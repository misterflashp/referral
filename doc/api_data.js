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
            "description": "<p>Device ID of client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Account address of client.</p>"
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
            "description": "<p>Device ID of client.</p>"
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
          "content": "{\n  success: true,\n  account: {\n    deviceId: String,\n    referralId: String,\n    address: String,\n    referredBy: String,\n    addedOn: Date\n  }\n}",
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
    "url": "/accounts",
    "title": "To get list of all accounts.",
    "name": "getAccount",
    "group": "Account",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorWhileFetchingAccounts",
            "description": "<p>Error while fetching accounts.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileFetchingAccounts-Response:",
          "content": "{\n  success: false,\n  message: 'Error occoured while fetching accounts.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  account: {\n    deviceId: String,\n    referralId: String,\n    addedOn: Date,\n    refs: []\n  }\n}",
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
            "description": "<p>Device ID of client.</p>"
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
            "description": "<p>Device ID of client.</p>"
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
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BonusAlreadyClaimedOrNoBonusToClaim",
            "description": "<p>Bonus already claimed OR no bonuses to claim.</p>"
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
        },
        {
          "title": "BonusAlreadyClaimedOrNoBonusToClaim-Response:",
          "content": "{\n  success: false,\n  message: 'Bonus already claimed OR no bonuses to claim.'\n}",
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
  },
  {
    "type": "get",
    "url": "/bonus/info",
    "title": "To get bonus information.",
    "name": "getBonusInfo",
    "group": "Bonus",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Device ID of client.</p>"
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
          "content": "{\n  success: true,\n  bonuses: {\n    snc: Number,\n    slc: Number,\n    ref: Number\n  },\n  refCount: Number,\n  canClaim: Boolean,\n  canClaimAfter: Date\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/bonus.controller.js",
    "groupTitle": "Bonus"
  },
  {
    "type": "get",
    "url": "/leaderboard",
    "title": "To fetch leaderboard.",
    "name": "getLeaderBoard",
    "group": "Leaderboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sortBy",
            "description": "<p>Attribute to sort, Available attributes [deviceId, referredBy, referralId, addedOn, refCount], default sortBy is 'refCount'.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "start",
            "description": "<p>Number of records to skip, default value is 0 and use positive numbers.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>Number of records to return, default value is 10, use positive numbers.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>Order to sort [asc/desc], Default sort [desc].</p>"
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
            "field": "ErrorWhileFetchingData",
            "description": "<p>Error while fetching leaderboard.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileFetchingData-Response:",
          "content": "{\n  success: false,\n  message: 'Error while fetching data.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "\n{\n \"success\": true,\n \"info\": [\n   {\n     \"deviceId\": \"0000000000000000\",\n     \"referredBy\": \"SENT-XXXXXXXX\",\n     \"referralId\": \"SENT-XXXXXXXX\",\n     \"addedOn\":    \"2018-08-08T07:30:04.969Z\",\n     \"refs\": [\n        \"SENT-XXXXXXXY\",\n        \"SENT-XXXXXXXZ\",\n        \"SENT-XXXXXXXW\",\n        \"SENT-XXXXXXXL\"\n       ]\n   }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Leaderboard"
  }
] });
