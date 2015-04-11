module.exports = {
	'port': process.env.PORT || 8080,
	'database': 'database',
	'session_secret': 'session_secret',
	'google_client_id': 'google_client_id',
	'google_client_secret': 'google_client_secret',
	'callback': 'http://localhost:8080/auth/google/callback',
	'mandrill_key' : 'mandrill_key',
	'twilio_sid': 'twilio_sid',
	'twilio_auth_token' : 'twilio_auth_token'
}
