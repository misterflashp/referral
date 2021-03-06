define({ "api": [
  {
    "type": "POST",
    "url": "/accounts",
    "title": "To add account.",
    "name": "addAccount",
    "group": "Accounts",
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
          "title": "DeviceIdAlreadyExists-Response:",
          "content": "{\n  success: false,\n  errorCode: 1001,\n  message: 'Device is already registered.'\n}",
          "type": "json"
        },
        {
          "title": "ReferredByNotExists-Response:",
          "content": "{\n  success: false,\n  errorCode: 1003,\n  message: 'No account exists with referredBy.'\n}",
          "type": "json"
        },
        {
          "title": "AddressAlreadyAssociatedWithOtherDevice-Response:",
          "content": "{\n  success: false,\n  errorCode: 1002,\n  message: 'Address already associated with another device.'\n}",
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
    "groupTitle": "Accounts"
  },
  {
    "type": "GET",
    "url": "/accounts/:type/:value",
    "title": "To get account information.",
    "name": "getAccount",
    "group": "Accounts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>[deviceId || address]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>deviceId or address based on type.</p>"
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
            "field": "InvalidType",
            "description": "<p>Provided type is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceNotRegistered-Response:",
          "content": "{\n  success: false,\n  errorCode: 1005,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        },
        {
          "title": "InvalidType-Response:",
          "content": "{\n  success: false,\n  errorCode: 1004,\n  message: 'Invalid type.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  account: {\n    deviceId: String,\n    referralId: String,\n    address: String,\n    referredBy: String,\n    addedOn: Date,\n    linked: Bool\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Accounts"
  },
  {
    "type": "get",
    "url": "/accounts",
    "title": "To get list of all accounts.",
    "name": "getAccount",
    "group": "Accounts",
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
      }
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  accounts: [{\n    deviceId: String,\n    referralId: String,\n    addedOn: Date,\n    refs: []\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Accounts"
  },
  {
    "type": "POST",
    "url": "/accounts/link/:sncRefId/:slcRefId",
    "title": "To link the accounts.",
    "name": "linkAccounts",
    "group": "Accounts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sncRefId",
            "description": "<p>SNC referral ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "slcRefId",
            "description": "<p>SLC referral ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Etherem account address that is connected with sncRefId.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Device ID that is connected with slcRefId.</p>"
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
            "field": "InvalidRefAddressCombination",
            "description": "<p>Provided sncrefId and address are invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRefDeviceIdCombination",
            "description": "<p>Provided slcrefId and deviceId are invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DuplicateEntry",
            "description": "<p>Provided fields are duplicate</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRefAddressCombination-Response:",
          "content": "{\n  success: false,\n  errorCode: 1007,\n  message: 'Invalid address and ref code combination.'\n}",
          "type": "json"
        },
        {
          "title": "InvalidRefDeviceIdCombination-Response:",
          "content": "{\n  success: false,\n  errorCode: 1008,\n  message: 'Invalid deviceId and ref code combination.'\n}",
          "type": "json"
        },
        {
          "title": "DuplicateEntry-Response:",
          "content": "{\n  success: false,\n  errorCode: 1009,\n  message: 'Duplicate values.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  message: 'Accounts linked successfully.'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Accounts"
  },
  {
    "type": "PUT",
    "url": "/accounts/:deviceId",
    "title": "To update account address.",
    "name": "updateAccount",
    "group": "Accounts",
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
            "field": "AddressAlreadyAssociatedWithOtherDevice",
            "description": "<p>Provided address already associated with another device.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceIdNotRegistered-Response:",
          "content": "{\n  success: false,\n  errorCode: 1005,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        },
        {
          "title": "AddressAlreadyAssociatedWithOtherDevice-Response:",
          "content": "{\n  success: false,\n  errorCode: 1002,\n  message: 'Address already associated with another device.'\n}",
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
    "groupTitle": "Accounts"
  },
  {
    "type": "POST",
    "url": "/accounts/:deviceId/bonuses/claim",
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
            "description": "<p>Device ID of linked account.</p>"
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
            "field": "CantClaimBonus",
            "description": "<p>Not satisfying the bonus claim conditions</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "DeviceNotRegistered-Response:",
          "content": "{\n  success: false,\n  errorCode: 1005,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        },
        {
          "title": "CantClaimBonus-Response:",
          "content": "{\n  success: false,\n  errorCode: 1006,\n  message: 'You can\\'t claim bonus.'\n}",
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
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Bonus"
  },
  {
    "type": "GET",
    "url": "/accounts/:deviceId/bonuses/info",
    "title": "To get bonus information.",
    "name": "getBonuses",
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
          "content": "{\n  success: false,\n  errorCode: 1005,\n  message: 'Device is not registered.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "{\n  success: true,\n  bonuses: {\n    slc: Number,\n    ref: Number,\n    other: Number\n  },\n  refCount: Number,\n  canClaim: Boolean,\n  canClaimAfter: Date\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/account.controller.js",
    "groupTitle": "Bonus"
  },
  {
    "type": "post",
    "url": "/dashboard/search",
    "title": "To search dashboard.",
    "name": "dashSearch",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "feilds",
            "description": "<p>Attributes to search in, Available attributes [deviceId, referredBy, referralId, address], default search is in all attributes.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "searchKey",
            "description": "<p>Key to search.</p>"
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
            "field": "ErrorWhileSearchingData",
            "description": "<p>Error while searching dashboard.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ErrorWhileSearchingData-Response:",
          "content": "{\n  success: false,\n  message: 'Error while searching data.'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "\n{\n \"success\": true,\n \"info\": [\n   {\n     \"deviceId\": \"0000000000000000\",\n     \"referredBy\": \"SENT-XXXXXXXX\",\n     \"address\": \"0x8d4HHHE8DeE87a191dD02E52639a3af1A678UDJS\"\n     \"referralId\": \"SENT-XXXXXXXX\",\n     \"addedOn\":    \"2018-08-08T07:30:04.969Z\"\n   }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/dashboard.controller.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "get",
    "url": "/dashboard",
    "title": "To fetch dashboard.",
    "name": "getDashBoard",
    "group": "Dashboard",
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
            "description": "<p>Error while fetching dashboard.</p>"
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
    "filename": "server/controllers/dashboard.controller.js",
    "groupTitle": "Dashboard"
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
            "description": "<p>Attribute to sort, Available attributes [bandwidth, tokens, referral], default sortBy is 'tokens'.</p>"
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
          "content": "{\n  success: false,\n  message: 'Error while fetching [accounts/bonuses/sessionUsage/refCount].'\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response: ",
          "content": "\n{\n \"success\": true,\n \"info\": [\n   {\n     \"index\":   00000000\n     \"deviceId\": 0000000000000000,\n     \"tokens\":   0000000000000000,\n     \"referralId\": \"SENT-XXXXXXXX\"\n     \"noOfReferrals\": 00000000,\n     \"noOfSessions\":  00000000,\n     \"totalUsage\": XXXXXXXX (In bytes)\n   }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/leaderboard.controller.js",
    "groupTitle": "Leaderboard"
  }
] });
