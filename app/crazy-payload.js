module.exports = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "Hi Team! What do you want today?"
		}
	},
	{
		"type": "divider"
	},
	{
		"type": "actions",
		"elements": [
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Manage Clusters",
					"emoji": true
				},
				"value": "[ClusterManager]SelectCluster"
			},
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Pair Uplinks",
					"emoji": true
				},
				"value": "[UplinksManager]SelectCluster"
			},
		]
	},
]