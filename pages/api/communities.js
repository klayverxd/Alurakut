// BFF - backend for frontend

import { SiteClient } from 'datocms-client'

export default async function getRequests(request, response) {
	if (request.method === 'POST') {
		const TOKEN = 'fddef0dc27fd32f32e585e94b84bef'
		const client = new SiteClient(TOKEN)

		const record = await client.items.create({
			itemType: '970975', //model ID
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
