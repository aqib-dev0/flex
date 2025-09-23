/**
 * Script to seed review data into the application
 * This script copies sample review data into the data directory
 */
const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'backend', 'src', 'data', 'hostaway', 'reviews.json');
const backupPath = path.join(rootDir, 'backend', 'src', 'data', 'hostaway', 'reviews.backup.json');

// Check if reviews data exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source file ${sourcePath} does not exist.`);
  console.error('Make sure you have created the required directory structure and files.');
  process.exit(1);
}

// Create a backup of the current data
if (fs.existsSync(sourcePath)) {
  try {
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`✓ Created backup of current data at ${backupPath}`);
  } catch (error) {
    console.error(`Error creating backup: ${error.message}`);
    process.exit(1);
  }
}

// Sample Hostaway reviews to seed
const hostawayReviews = [
  {
    "id": "7453",
    "reservationId": "61432",
    "messageId": null,
    "listingMapId": "123456",
    "listingName": "2B N1 A - 29 Shoreditch Heights",
    "reviewer": {
      "id": "9872",
      "name": "Shane Finkelstein",
      "picture": "https://hostaway.com/users/shane.jpg"
    },
    "reviewerType": "host",
    "hostId": "1234",
    "guestId": "9872",
    "type": "RESERVATION",
    "status": "VISIBLE",
    "comment": "Shane and family are wonderful! Would definitely host again :)",
    "privateComment": "They left the place very clean, great communication.",
    "score": {
      "general": 9.5,
      "cleanliness": 10,
      "communication": 10,
      "respect_house_rules": 10,
      "experience": 8
    },
    "channel": "hostaway",
    "createdTime": "2020-08-21T22:45:14.000Z",
    "updatedTime": "2020-08-22T10:15:05.000Z"
  },
  {
    "id": "8932",
    "reservationId": "72185",
    "messageId": "msg-51234",
    "listingMapId": "987421",
    "listingName": "Luxury Apartment in Central London",
    "reviewer": {
      "id": "6543",
      "name": "Maria Rodriguez",
      "picture": "https://hostaway.com/users/maria.jpg"
    },
    "reviewerType": "guest",
    "hostId": "1234",
    "guestId": "6543",
    "type": "RESERVATION",
    "status": "VISIBLE",
    "comment": "Beautiful apartment, great location. Some issues with hot water but host was responsive.",
    "privateComment": null,
    "score": {
      "general": 8.5,
      "cleanliness": 9,
      "communication": 10,
      "accuracy": 7,
      "location": 10,
      "value": 8,
      "check_in": 9
    },
    "channel": "airbnb",
    "createdTime": "2021-05-12T15:23:45.000Z",
    "updatedTime": "2021-05-12T15:23:45.000Z"
  },
  {
    "id": "9125",
    "reservationId": "81543",
    "messageId": null,
    "listingMapId": "394872",
    "listingName": "Cozy Studio in Camden Town",
    "reviewer": {
      "id": "3214",
      "name": "John Smith",
      "picture": null
    },
    "reviewerType": "guest",
    "hostId": "1234",
    "guestId": "3214",
    "type": "RESERVATION",
    "status": "HIDDEN",
    "comment": "Smaller than it looked in photos but very clean and good value.",
    "privateComment": "Guest was quiet and respectful.",
    "score": {
      "general": 7.0,
      "cleanliness": 10,
      "communication": 6,
      "accuracy": 5,
      "location": 8,
      "value": 9,
      "check_in": 7
    },
    "channel": "booking",
    "createdTime": "2022-01-07T08:14:22.000Z",
    "updatedTime": "2022-01-08T11:32:45.000Z"
  },
  {
    "id": "10432",
    "reservationId": "92785",
    "messageId": "msg-67890",
    "listingMapId": "123456",
    "listingName": "2B N1 A - 29 Shoreditch Heights",
    "reviewer": {
      "id": "7890",
      "name": "Emma Watson",
      "picture": "https://hostaway.com/users/emma.jpg"
    },
    "reviewerType": "host",
    "hostId": "1234",
    "guestId": "7890",
    "type": "RESERVATION",
    "status": "VISIBLE",
    "comment": "Emma was a fantastic guest, very respectful and communicative.",
    "privateComment": "Would definitely host again, no issues at all.",
    "score": {
      "general": 10,
      "cleanliness": 10,
      "communication": 10,
      "respect_house_rules": 10
    },
    "channel": "hostaway",
    "createdTime": "2022-04-18T14:35:28.000Z",
    "updatedTime": "2022-04-18T14:35:28.000Z"
  },
  {
    "id": "11567",
    "reservationId": "105432",
    "messageId": null,
    "listingMapId": "987421",
    "listingName": "Luxury Apartment in Central London",
    "reviewer": {
      "id": "8901",
      "name": "David Chen",
      "picture": "https://hostaway.com/users/david.jpg"
    },
    "reviewerType": "guest",
    "hostId": "1234",
    "guestId": "8901",
    "type": "RESERVATION",
    "status": "VISIBLE",
    "comment": "",
    "privateComment": null,
    "score": {
      "general": 6.5,
      "cleanliness": 5,
      "communication": 7,
      "accuracy": 6,
      "location": 9,
      "value": 6,
      "check_in": 6
    },
    "channel": "expedia",
    "createdTime": "2022-09-30T17:22:19.000Z",
    "updatedTime": "2022-09-30T17:22:19.000Z"
  },
  {
    "id": "12789",
    "reservationId": "117654",
    "messageId": "msg-78901",
    "listingMapId": "394872",
    "listingName": "Cozy Studio in Camden Town",
    "reviewer": null,
    "reviewerType": null,
    "hostId": "1234",
    "guestId": null,
    "type": "SYSTEM",
    "status": "DRAFT",
    "comment": null,
    "privateComment": null,
    "score": null,
    "channel": "hostaway",
    "createdTime": "2023-02-15T09:45:11.000Z",
    "updatedTime": "2023-02-15T09:45:11.000Z"
  }
];

// Write the seed data to the file
try {
  fs.writeFileSync(sourcePath, JSON.stringify(hostawayReviews, null, 2));
  console.log(`✓ Successfully seeded ${hostawayReviews.length} Hostaway reviews.`);
  console.log(`✓ Data written to ${sourcePath}`);
} catch (error) {
  console.error(`Error writing seed data: ${error.message}`);
  process.exit(1);
}

console.log('✅ Seed process completed successfully.');
