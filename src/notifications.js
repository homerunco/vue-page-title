let notificationsCount = 0;

export const setNotificationsCount = (value = 0) => {
  notificationsCount = value;
};

export const getNotificationsCount = () => notificationsCount;
