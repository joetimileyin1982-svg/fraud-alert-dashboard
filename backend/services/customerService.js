const Customer = require("../models/Customer");

const createCustomer = async (data) => {
  return Customer.create(data);
};

const getCustomers = async () => {
  return Customer.find().sort({ createdAt: -1 });
};

const getCustomerById = async (id) => {
  return Customer.findById(id);
};

const updateCustomer = async (id, data) => {
  return Customer.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  );
};

const updateCustomerStatus = async (id, status) => {
  return Customer.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus
};
