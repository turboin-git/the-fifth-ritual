import api from './axios';

export const getAvailableSlots = (artistId, date) =>
  api.get(`/appointments/available-slots?artistId=${artistId}&date=${date}`);

export const bookAppointment = (data) =>
  api.post('/appointments/book', data);

export const getClientAppointments = (clientId) =>
  api.get(`/appointments/client/${clientId}`);

export const getArtistAppointments = (artistId) =>
  api.get(`/appointments/artist/${artistId}`);