define({ "api": [
  {
    "type": "post",
    "url": "/referral",
    "title": "To add referral address.",
    "name": "addReferral",
    "group": "Referral",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clientAddress",
            "description": "<p>Address of client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "referralAddress",
            "description": "<p>Referrer address which is valid.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClientAddressSameAsReferralAddress",
            "description": "<p>Client cannot add his own address as referral address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClientAddressAlreadyExists",
            "description": "<p>Provided address already exists</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ReferralAddressNotExists",
            "description": "<p>Provided referral address already exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ClientAddressSameAsReferralAddress:",
          "content": "{\n  success: false,\n  message: 'Client address and Referral address should not be same.'\n}",
          "type": "json"
        },
        {
          "title": "ClientAddressAlreadyExists-Response:",
          "content": "{\n  success: false,\n  message: 'Client address is already exists.'\n}",
          "type": "json"
        },
        {
          "title": "ReferralAddressNotExists-Response:",
          "content": "{\n  success: false,\n  message: 'Referral address is not exist.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  message: 'Referral address added successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/referral.controller.js",
    "groupTitle": "Referral"
  },
  {
    "type": "post",
    "url": "/referral/claim",
    "title": "To claim referral bonus.",
    "name": "claimBonus",
    "group": "Referral",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of client.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoReferralAddressExists",
            "description": "<p>No one used this client address as referral address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BonusAlreadyClaimed",
            "description": "<p>Provided address already claimed for bonus</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PaymentTxNotFound",
            "description": "<p>Provided address not made first payment yet.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoReferralAddressExists-Response:",
          "content": "{\n  success: false,\n  message: 'No referral address exists.'\n}",
          "type": "json"
        },
        {
          "title": "BonusAlreadyClaimed-Response:",
          "content": "{\n  success: false,\n  message: 'Bonus already claimed.'\n}",
          "type": "json"
        },
        {
          "title": "PaymentTxNotFound-Response:",
          "content": "{\n  success: false,\n  message: 'Payment tx hash not found.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  success: true,\n  message: 'Bonus claimed successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/referral.controller.js",
    "groupTitle": "Referral"
  },
  {
    "type": "get",
    "url": "/referral/info",
    "title": "To get referral information.",
    "name": "getReferralInfo",
    "group": "Referral",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of client.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoReferralAddressExists",
            "description": "<p>No one used this client address as referral address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoReferralAddressExists-Response:",
          "content": "{\n  success: false,\n  message: 'No referral address exists.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isClaimed",
            "description": "<p>Status of claim</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "joinBonus",
            "description": "<p>Referral amount earned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "referral",
            "description": "<p>Information about referral earnings.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "{\n  success: true,\n  isClaimed: true,\n  joinBonus: 20000000000,\n  referral: {\n      count: 4,\n      amount: 40000000000\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/referral.controller.js",
    "groupTitle": "Referral"
  }
] });
