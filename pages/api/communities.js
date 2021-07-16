// BFF - backend for frontend

import { SiteClient } from 'datocms-client'

export default async function getRequests(request, response) {
	if (request.method === 'POST') {
		const TOKEN = 'ba3742e60773e7d425ce255028887b'
		const client = new SiteClient(TOKEN)

		const record = await client.items.create({
			itemType: '966545', //model ID
			...request.body,
		})

		response.json({
			dados: 'Comunidade criada com sucesso',
			record,
		})

		return
	}

	response.status(404).json({
		message: 'Ainda não temos nada no GET, mas no POST tem!',
	})
}
