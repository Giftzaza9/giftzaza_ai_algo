const bizSdk = require('facebook-nodejs-business-sdk');
const config = require('../config/config');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const Content = bizSdk.Content;

const access_token = config.eventTracker.meta_access_token;
const pixel_id = config.eventTracker.pixel_id;
const api = bizSdk.FacebookAdsApi.init(access_token);

let current_timestamp = Math.floor(new Date() / 1000);

function hash(data) {
  return require('crypto').createHash('sha256').update(data).digest('hex');
}

function createUserData(user) {
  return new UserData()
    .setEmail(hash(user.email))
    .setFirstName(hash(user.name))
    .setExternalId(hash(user._id?.toString() || user.id));
}

function createProfileData(profile) {
  return new Content().setId(profile._id?.toString() || profile.id).setTitle(profile.title);
}

function createProductData(product) {
  return new Content()
    .setId(product._id?.toString() || product.id)
    .setTitle(product.title)
    .setBrand(product.link);
}

function emitEvent(serverEvent) {
  const eventsData = [serverEvent];
  const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);

  eventRequest
    .execute()
    // .then((response) => console.log('Event sent:', response))
    .catch((error) => console.error('Error sending event to Meta:', error));
}

const emitSignupEvent = (user) => {
  const userData = createUserData(user);

  const serverEvent = new ServerEvent()
    .setEventName('SIGNUP')
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

const emitProfileEvent = (profile, user) => {
  const userData = createUserData(user);
  const profileData = createProfileData(profile);

  const serverEvent = new ServerEvent()
    .setEventName('NEW_PROFILE')
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setCustomData(profileData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

const emitCardEvent = async (userActivity, user, product) => {
  const eventName = userActivity.activity?.toUpperCase();
  const userData = createUserData(user);
  const productData = createProductData(product);

  const serverEvent = new ServerEvent()
    .setEventName(eventName)
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setCustomData(productData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

module.exports = { emitSignupEvent, emitProfileEvent, emitCardEvent };
