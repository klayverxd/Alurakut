import { useEffect, useState } from 'react'

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {
	AlurakutMenu,
	AlurakutProfileSidebarMenuDefault,
	OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(props) {
	return (
		<Box as="aside">
			<img
				src={`https://github.com/${props.githubUser}.png`}
				style={{ borderRadius: '8px' }}
			/>
			<hr />
			<p>
				<a
					className="boxLink"
					href={`https://github.com/${props.githubUser}`}
					target="_blank"
				>
					@{props.githubUser}
				</a>
			</p>

			<hr />

			<AlurakutProfileSidebarMenuDefault />
		</Box>
	)
}

function ProfileRelationsBox({ items, title }) {
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className="smallTitle">
				{title} ({items.length})
			</h2>

			{/* <ul>
				{items.map(item => {
					return (
						<li key={item}>
							<a href={`/users/${item}`}>
								<img src={item} />
								<span>{item}</span>
							</a>
						</li>
					)
				})}
			</ul> */}
		</ProfileRelationsBoxWrapper>
	)
}

export default function Home() {
	const githubUser = 'klayverxd'
	const [communities, setCommunities] = useState([])
	const pessoasFavoritas = [
		'alannapaiva',
		'williambrunos',
		'JanniellyGarcia',
		'RogVenancio',
		'LaisFSGomes',
		'jessicaMarquess',
	]
	const [followers, setFollowers] = useState([])
	const [creatingCommunity, setCreatingCommunity] = useState(false)

	const [formCreateCommunity, setFormCreateCommunity] = useState({
		title: '',
		imageUrl: '',
	})

	const handleFormCreateCommunity = event => {
		setFormCreateCommunity({
			...formCreateCommunity,
			[event.target.name]: event.target.value,
		})
	}

	useEffect(() => {
		// API GitHub
		fetch('https://api.github.com/users/klayverxd/followers')
			.then(res => {
				return res.json()
			})
			.then(res => {
				setFollowers(res)
			})

		// API GraphQL
		fetch('https://graphql.datocms.com/', {
			method: 'POST',
			headers: {
				Authorization: 'fb9583068205775106a0d01df0e196',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `query {
				allCommunities {
				  id
				  title
				  imageUrl
				  creatorSlug
				}
			  }`,
			}),
		})
			.then(res => res.json())
			.then(res => {
				const communities = res.data.allCommunities
				setCommunities(communities)
			})
	}, [])

	function handleCreateComunity(e) {
		setCreatingCommunity(true)
		e.preventDefault()

		const community = {
			...formCreateCommunity,
			creatorSlug: githubUser,
		}

		fetch('/api/communities', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(community),
		}).then(async response => {
			const data = await response.json()
			const newCommunity = data.record

			setCommunities([...communities, newCommunity])
			setFormCreateCommunity({
				title: '',
				imageUrl: '',
			})
			setCreatingCommunity(false)
		})
	}

	return (
		<>
			<AlurakutMenu githubUser={githubUser} />
			<MainGrid>
				<div className="profileArea" style={{ gridArea: 'profileArea' }}>
					<ProfileSidebar githubUser={githubUser} />
				</div>
				<div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>
					<Box>
						<h2 className="titlesubTitle">O que você deseja fazer?</h2>

						<form onSubmit={handleCreateComunity}>
							<div>
								<input
									type="text"
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									value={formCreateCommunity.title}
									onChange={handleFormCreateCommunity}
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Coloque o URL para usarmos de capa"
									name="imageUrl"
									aria-label="Coloque o URL para usarmos de capa"
									value={formCreateCommunity.imageUrl}
									onChange={handleFormCreateCommunity}
								/>
							</div>
							<button>
								{creatingCommunity
									? 'Criando comunidade...'
									: 'Criar comunidade'}
							</button>
						</form>
					</Box>
				</div>
				<div
					className="profileRelationsArea"
					style={{ gridArea: 'profileRelationsArea' }}
				>
					<ProfileRelationsBox items={followers} title="Seguidores" />
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Comunidades ({communities.length})</h2>

						<ul>
							{communities.map(community => {
								return (
									<li key={community.id}>
										<a href={`/communities/${community.id}`} target="_blank">
											<img src={community.imageUrl} />
											<span>{community.title}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da comunidade ({pessoasFavoritas.length})
						</h2>

						<ul>
							{pessoasFavoritas.map(user => {
								return (
									<li key={user}>
										<a href={`/users/${user}`} target="_blank">
											<img src={`https://github.com/${user}.png`} />
											<span>{user}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	)
}
