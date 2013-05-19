module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'dev':
      return {
        "auth": {
          "twitter": {
            "consumerkey" : "y2d25dduG2EKcMxEm4iPg",
            "consumersecret" : "uzInpVYECGhAARDSa2pmvepHxCXi33RXIBol7Y",
            "callback" : "http://localhost:6789/auth/twitter/callback"
          },
          "facebook": {
            "clientid" : "572742529414533",
            "clientsecret" : "2480ef6767576e53a9e7632effe8d256",
            "callback" : "http://localhost:6789/auth/facebook/callback"
          }
        },
        "theme": {
          "name" : "default"
        },
        "session" : {
          "secret" : "yourbestsecret"
        },
        "app": {
          "port": 6789
        }
      };

    case 'prod':
      return {
        "auth": {
          "twitter": {
            "consumerkey" : "y2d25dduG2EKcMxEm4iPg",
            "consumersecret" : "uzInpVYECGhAARDSa2pmvepHxCXi33RXIBol7Y",
            "callback" : "http://localhost:6789/auth/twitter/callback"
          },
          "facebook": {
            "clientid" : "572742529414533",
            "clientsecret" : "2480ef6767576e53a9e7632effe8d256",
            "callback" : "http://localhost:6789/auth/facebook/callback"
          }
        },
        "theme": {
          "name" : "default"
        },
        "session" : {
          "secret" : "yourbestsecret"
        },
        "app": {
          "port": 6789
        }
      };

    default:
      return {
      "auth": {
        "twitter": {
          "consumerkey" : "y2d25dduG2EKcMxEm4iPg",
          "consumersecret" : "uzInpVYECGhAARDSa2pmvepHxCXi33RXIBol7Y",
          "callback" : "http://localhost:6789/auth/twitter/callback"
        },
        "facebook": {
          "clientid" : "572742529414533",
          "clientsecret" : "2480ef6767576e53a9e7632effe8d256",
          "callback" : "http://localhost:6789/auth/facebook/callback"
        }
      },
      "theme": {
        "name" : "default"
      },
      "session" : {
        "secret" : "yourbestsecret"
      },
      "app": {
        "port": 6789
      }
    };
  }
};
