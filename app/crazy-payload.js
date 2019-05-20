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
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*Demo disclaimer:* this bot is functioning in the preview mode, with actual cluster management disabled until proper debugging and logging applied. Stay tuned! ETA: May 27"
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
					"text": "Discover Uplinks",
					"emoji": true
				},
				"value": "[UplinksManager]DiscoverUplinks"
			},
		]
	},
]