const { Balance, User, Service, Transaction, sequelize } = require("../models")
const { QueryTypes } = require('sequelize');

class TransactionController {

    static async getBalance(req, res, next) {
        try {
            // Extract email from request 
            const { email } = req.user;

            const data = await Balance.findOne({
                include: [{
                    model: User,
                    where: {
                        email
                    },
                    attributes: []
                }],
                attributes: ["balance"]
            })

            // Send response with only balance
            res.status(200).json({
                status: 0,
                message: "Sukses",
                data
            });
        } catch (error) {
            next(error);
        }
    }

    static async topUp(req, res, next) {
        try {
            const { top_up_amount } = req.body;

            // input Validation
            if (!top_up_amount || isNaN(top_up_amount) || +top_up_amount <= 0) {
                return res.status(400).json({ 
                    status: 0,
                    message: "Top up amount harus berupa angka dan lebih besar dari 0",
                    data: null
                });
            }

            const { email } = req.user;

            // Find user by email
            const dataUser = await User.findOne({
                where: { email }
            });
            // Find user balance by Userid
            const balanceUser = await Balance.findOne({
                where: { Userid: dataUser.id }
            });

            // Update user balance by adding top_up_amount
            await Balance.update({
                balance: +balanceUser.balance + +top_up_amount
            }, {
                where: { Userid: dataUser.id }
            });

            // Fetch updated balance after successful top-up
            const updatedBalance = await Balance.findOne({
                include: [{
                    model: User,
                    where: { email },
                    attributes: []
                }],
                attributes: ["balance"]
            });

            // Respond with success message and updated balance data
            res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: updatedBalance
            });
        } catch (error) {
            next(error);
        }
    }
    static async transaction(req, res, next) {
        try {
            const { email } = req.user;
            const { service_code } = req.body;

            const datasUser = await User.findOne({
                where: {
                    email
                }
            });

            const dataAllTransactions = await Transaction.findAll();

            const dataServices = await Service.findOne({
                where: {
                    service_code: service_code
                }
            });
            
            if (!dataServices) {
                return res.status(400).json({
                    status: 0,
                    message: "Service ataus Layanan tidak ditemukan",
                    data: null
                });
            }

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();
            const totalTransac = dataAllTransactions.length;
            const invoice_number = `INV${day}${month}${year}-${String(totalTransac + 1).padStart(3, '0')}`;


            const data = await Transaction.create({
                invoice_number: invoice_number,
                transaction_type: "PAYMENT",
                Userid: datasUser.id,
                Serviceid: dataServices.id
            });

            res.status(201).json({
                "status": 0,
                "message": "Transaksi berhasil",
                "data": {
                    "invoice_number": invoice_number,
                    "service_code": dataServices.service_code,
                    "service_name": dataServices.service_name,
                    "transaction_type": "PAYMENT",
                    "total_amount": dataServices.service_tarif,
                    "created_on": data.createdAt
                }
            });
        } catch (error) {
            next(error);
        }
    }


    static async getHistoryTransaction(req, res, next) {
        try {

            const { email } = req.user
            const { limit, page } = req.query;

            const dataUser = await User.findOne({
                where: {
                    email
                }
            })

            let pagination = {
                where: {
                    Userid: dataUser.id
                },
                limit: limit ? limit : 50,
                order: [["createdAt", "DESC"]],
            };

            if (page) {
                pagination.offset = (page - 1) * (limit ? limit : 50);
            }

            let dataTransaction = await Transaction.findAndCountAll(pagination);

            let totalPage = Math.ceil(dataTransaction.count / (limit ? limit : 50));

            res.status(200).json({
                status: 0,
                message: "Get History Berhasil",
                data: {
                    limit: limit ? limit : 0,
                    offset: pagination.offset ? pagination.offset : 0,
                    records: dataTransaction.rows,
                }

            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TransactionController