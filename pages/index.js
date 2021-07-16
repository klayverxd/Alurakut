import { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'

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

export default function Home(props) {
	const githubUser = props.githubUser
	const [communities, setCommunities] = useState([])
	const pessoasFavoritas = [
		'alannapaiva',
		'williambrunos',
		'JanniellyGarcia',
		'RogVenancio',
		'LaisFSGomes',
		'jessicaMarquess',
		'luanmooraes',
		'rafaelizidorio',
		'EmmanuelMoreira7',
		'Pedynho',
		'willianpraciano',
		'Krymancer',
		'netosouza22',
		'thainarapenha',
		'Fabriciox7',
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
				Authorization: '6c4d6ddb486be81d5454d74121ca1e',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `query {
				allCommunities {
				  id
				  title
				  imageUrl
				  creatorslug
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
			creatorslug: githubUser,
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
					<ProfileRelationsBox items={followers} title="Seguidores" />
				</div>
			</MainGrid>
		</>
	)
}

export async function getServerSideProps(context) {
	const cookies = nookies.get(context)
	const token = cookies.USER_TOKEN

	const { isAuthenticated } = await fetch(
		'https://alurakut.vercel.app/api/auth',
		{
			headers: {
				Authorization: token,
			},
		}
	).then(resposta => resposta.json())

	if (isAuthenticated) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	const { githubUser } = jwt.decode(token)

	return {
		props: {
			githubUser,
		},
	}
}
