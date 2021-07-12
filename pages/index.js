import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
	return (
		<Box>
			<img
				src={`https://github.com/${propriedades.githubUser}.png`}
				style={{ borderRadius: '8px' }}
			/>
		</Box>
	)
}

export default function Home() {
	const githubUser = 'klayverxd'
	const pessoasFavoritas = [
		'alannapaiva',
		'williambrunos',
		'JanniellyGarcia',
		'RogVenancio',
		'LaisFSGomes',
		'jessicaMarquess',
	]

	return (
		<>
			<AlurakutMenu />
			<MainGrid>
				<div className="profileArea" style={{ gridArea: 'profileArea' }}>
					<ProfileSidebar githubUser={githubUser} />
				</div>
				<div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>
				</div>
				<div
					className="profileRelationsArea"
					style={{ gridArea: 'profileRelationsArea' }}
				>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da comunidade ({pessoasFavoritas.length})
						</h2>

						<ul>
							{pessoasFavoritas.map(user => {
								return (
									<li key={user}>
										<a href={`/users/${user}`}>
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
