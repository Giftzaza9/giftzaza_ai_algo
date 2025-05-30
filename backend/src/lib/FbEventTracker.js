const bizSdk = require('facebook-nodejs-business-sdk');
const config = require('../config/config');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const Content = bizSdk.Content;

const access_token = config.eventTracker.meta_access_token;
const pixel_id = config.eventTracker.pixel_id;
const api = bizSdk.FacebookAdsApi.init(access_token);

/**
 * Creates a new instance of FB User Data class
 * @param {User} user 
 * @param {String} ip 
 * @returns UserData Object
 */
function createUserData(user, ip) {
  return new UserData()
    .setEmail(user.email)
    .setFirstName(user.name)
    .setClientIpAddress(ip)
    .setAppUserId(user._id?.toString() || user.id);
}

/**
 * Creates a new instance of FB SDK's Content class for the param-profile
 * @param {Profile} profile 
 * @returns new Content Object
 */
function createProfileData(profile) {
  return new Content().setId(profile._id?.toString() || profile.id).setTitle(profile.title);
}

/**
 * Creates a new instance of FB SDK's Content class for the param-product
 * @param {Product} product 
 * @returns new Content Object
 */
function createProductData(product) {
  return new Content()
    .setId(product._id?.toString() || product.id)
    .setTitle(product.title)
    .setDescription(product.description)
    .setQuantity(1)
    .setItemPrice(product.price)
    .setBrand(product.link);
}

/**
 * Emits the event (send POST req) to the FB API
 * @param {ServerEvent} serverEvent 
 */
function emitEvent(serverEvent) {
  const eventsData = [serverEvent];
  const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);

  eventRequest
    .execute()
    .then((response) => console.log('Event sent to Meta'))
    .catch((error) => console.error('Error sending event to Meta:', error));
}

// // // // // // // // // // // // // // // // // //

const emitSignupEvent = (user, ip) => {
  const userData = createUserData(user, ip);

  const serverEvent = new ServerEvent()
    .setEventName('SIGNUP')
    .setEventTime(Math.floor(new Date() / 1000))
    .setUserData(userData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

const emitProfileEvent = (profile, user, ip) => {
  const userData = createUserData(user, ip);
  const profileData = createProfileData(profile);

  const serverEvent = new ServerEvent()
    .setEventName('NEW_PROFILE')
    .setEventTime(Math.floor(new Date() / 1000))
    .setUserData(userData)
    .setCustomData(profileData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

const emitCardEvent = async (userActivity, user, product, ip) => {
  const eventName = userActivity.activity?.toUpperCase();
  const userData = createUserData(user, ip);
  const productData = createProductData(product);

  const serverEvent = new ServerEvent()
    .setEventName(eventName)
    .setEventTime(Math.floor(new Date() / 1000))
    .setUserData(userData)
    .setCustomData(productData)
    .setActionSource('website');

  emitEvent(serverEvent);
};

module.exports = { emitSignupEvent, emitProfileEvent, emitCardEvent };
