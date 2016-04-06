import React from 'react'

import {Alert} from 'react-bootstrap'

const SystemMessage = ({messages, clearMessage}) => {
	return (
		<div>
			{
				messages.map((m,id) => {
					return (
						<Alert bsStyle={m.type} key={id} onDismiss={clearMessage}>
					    {m.message}
						</Alert>						
					)
				})
			}
		</div>
	)
}


export default SystemMessage