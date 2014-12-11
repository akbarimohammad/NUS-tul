        //-------------------------------API lib-------------------------------------------
        var WoClient = function (clientId, options) {
            //basic settings
            var me = {},//the new WoAPI instance
                    host = "webobservatory.soton.ac.uk",
                    woHost = "https://" + host,
                    resourceHost = "https://" + host + "/api/wo/",
                    endUserAuthorizationEndpoint = woHost + "/oauth/authorise",
                    after = options.after,
                    before = options.before;

            me.authURL = endUserAuthorizationEndpoint +
            "?response_type=token" +
            "&client_id=" + clientId +
            "&redirect_uri=" + window.location;

            //private functions

            //helper function to extract the Access Token
            var extractToken = function (hash) {
                var match = hash.match(/access_token=((%|\w)+)/);
                return !!match && decodeURIComponent(match[1]);
            };

            //public functions

            //query a dataset identified by dataset id
            me.query = function (options, cb) {
                me.token = extractToken(document.location.hash);

                if (me.token) {
                    if (after && typeof after === 'function') {
                        after(me.token);
                    }

                    $.ajax(
                            {
                                type: 'get',
                                url: resourceHost + options.dataset + '/endpoint',
                                data: options.query,
                                headers: {
                                    Authorization: 'Bearer ' + me.token
                                }
                            }).done(cb);
                }
                else {
                    if (before && typeof before === 'function') {
                        before(me.authURL);
                    }
                }
            };
            return me;
        };
        //-------------------------------API lib-------------------------------------------

