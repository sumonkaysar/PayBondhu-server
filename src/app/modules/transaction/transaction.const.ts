export const TransactionFees = {
  CASH_IN: 0, // 0%
  CASH_OUT: 2, // 2%
  SEND_MONEY: 5, // 5 tk fee if amount > 100 or 0 tk
  ADD_MONEY: 1, // 1%
  WITHDRAW: 1.5, // 1.5%
};

export const TransactionCommissions = {
  CASH_IN: 0.5, // 0.5%
  CASH_OUT: 1, // 1%
  SEND_MONEY: 0, // 0%
  ADD_MONEY: 0, // 0%
  WITHDRAW: 0, // 0%
};
