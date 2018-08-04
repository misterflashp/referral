define({ "api": [
  {
    "type": "post",
    "url": "/account",
    "title": "To add account.",
    "name": "addAccount",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>device ID of client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "referredBy",
            "description": "<p>Referral ID which is valid.</p>"
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
            "field": "DeviceIdAlreadyExists",
            "description": "<p>Provided deviceId already exists</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ReferredByNotExists",
            "description": "<p>Provided referral ID not exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceIdAlreadyExists-Response:",
          "content": "{\n  success: false,\n  message: 'Device is already registered.'\n}",
          "type": "json"
        },
        {
          "title": "ReferredByNotExists-Response:",
          "content": "{\n  success: false,\n  message: 'No account exists with referredBy.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  message: 'Account added successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/account",
    "title": "To get account information.",
    "name": "getAccount",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>device ID of client.</p>"
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
            "field": "DeviceNotRegistered",
            "description": "<p>Provided device ID not registered.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceNotRegistered-Response:",
          "content": "{\n  success: false,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  account: {\n             deviceId: String,\n             referralId: String,\n             address: String,\n             referredBy: String,\n             addedOn: Date\n            }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Account"
  },
  {
    "type": "put",
    "url": "/account",
    "title": "To update account address.",
    "name": "updateAccount",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>device ID of client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Account address of client.</p>"
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
            "field": "DeviceIdNotRegistered",
            "description": "<p>Provided device ID not registered.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AccountAddressAlreadyExists",
            "description": "<p>Provided device ID already linked with an address.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AddressAlreadyAssociatedWithOtherDevice",
            "description": "<p>Provided address already associated with another device.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceIdNotRegistered-Response:",
          "content": "{\n  success: false,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        },
        {
          "title": "AccountAddressAlreadyExists-Response:",
          "content": "{\n  success: false,\n  message: 'Account address already exists.'\n}",
          "type": "json"
        },
        {
          "title": "AddressAlreadyAssociatedWithOtherDevice-Response:",
          "content": "{\n  success: false,\n  message: 'Address already associated with another device.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  message: 'Account updated successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/bonus/claim",
    "title": "To claim bonus.",
    "name": "bonusClaim",
    "group": "Bonus",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>device ID of client.</p>"
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
            "field": "DeviceNotRegistered",
            "description": "<p>Provided device ID not registered.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoAccountAddressExists",
            "description": "<p>No account address attached for provided deviceId.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceNotRegistered-Response:",
          "content": "{\n  success: false,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        },
        {
          "title": "NoAccountAddressExists-Response:",
          "content": "{\n  success: false,\n  message: 'No account address exists.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  message: 'Bonus claimed successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/bonus.controller.js",
    "groupTitle": "Bonus"
  }
] });
