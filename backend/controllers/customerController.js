const customerService = require("../services/customerService");

const createCustomer = async (req, res) => {
  const customer = await customerService.createCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    customer
  });
};

const getCustomers = async (req, res) => {
  const customers = await customerService.getCustomers();

  res.status(200).json({
    success: true,
    count: customers.length,
    customers
  });
};

const getCustomer = async (req, res) => {
  const customer = await customerService.getCustomerById(
    req.params.id
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  res.status(200).json({
    success: true,
    customer
  });
};

const updateCustomer = async (req, res) => {
  const customer = await customerService.updateCustomer(
    req.params.id,
    req.body
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    customer
  });
};

const updateCustomerStatus = async (req, res) => {
  const { status } = req.body;

  if (!["active", "suspended"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status"
    });
  }

  const customer = await customerService.updateCustomerStatus(
    req.params.id,
    status
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Customer status updated successfully",
    customer
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  updateCustomerStatus
};
