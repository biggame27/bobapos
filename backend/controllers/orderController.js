const pool = require('../config/database');

const getAllOrders = async (req, res) => {
    try {
        const query = 'SELECT orderid, timeoforder, customerid, employeeid, totalcost, orderweek FROM orders ORDER BY timeoforder DESC';
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const createOrder = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { timeoforder, customerid, employeeid, totalcost, orderweek, orderItems } = req.body;

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
        }

        // Validate inventory
        for (const orderItem of orderItems) {
            const checkQuery = `
                SELECT i.ingredientID, i.ingredientCount, mi.ingredientQty 
                FROM inventory i 
                INNER JOIN MenuItemIngredients mi ON i.ingredientID = mi.ingredientID 
                WHERE mi.menuItemID = $1
            `;
            const ingredientResult = await client.query(checkQuery, [orderItem.menuitemid]);
            
            for (const row of ingredientResult.rows) {
                const available = row.ingredientcount;
                const requiredPerDrink = row.ingredientqty;
                const totalRequired = requiredPerDrink * orderItem.quantity;
                
                if (available < totalRequired) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ 
                        success: false, 
                        error: `Insufficient inventory for ingredient ID: ${row.ingredientid}` 
                    });
                }
            }
        }

        // Get next order ID
        const orderIdResult = await client.query('SELECT COALESCE(MAX(orderid), 0) + 1 as next_id FROM orders');
        const orderId = orderIdResult.rows[0].next_id;

        // Insert order
        const orderQuery = 'INSERT INTO orders (orderid, timeoforder, customerid, employeeid, totalcost, orderweek) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const orderResult = await client.query(orderQuery, [
            orderId,
            timeoforder || new Date(),
            customerid || null,
            employeeid,
            totalcost,
            orderweek
        ]);

        // Insert order items
        const itemQuery = 'INSERT INTO orderitems (orderitemid, orderid, menuitemid, quantity) VALUES ($1, $2, $3, $4)';
        for (const item of orderItems) {
            const itemIdResult = await client.query('SELECT COALESCE(MAX(orderitemid), 0) + 1 as next_id FROM orderitems');
            const itemId = itemIdResult.rows[0].next_id;
            await client.query(itemQuery, [itemId, orderId, item.menuitemid, item.quantity]);
        }

        // Update inventory
        for (const orderItem of orderItems) {
            const ingredientQuery = 'SELECT ingredientID, ingredientQty FROM MenuItemIngredients WHERE menuItemID = $1';
            const ingredientResult = await client.query(ingredientQuery, [orderItem.menuitemid]);
            
            for (const row of ingredientResult.rows) {
                const totalNeeded = row.ingredientqty * orderItem.quantity;
                const updateQuery = 'UPDATE inventory SET ingredientCount = ingredientCount - $1 WHERE ingredientID = $2';
                await client.query(updateQuery, [totalNeeded, row.ingredientid]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, data: orderResult.rows[0] });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllOrders,
    createOrder
};


