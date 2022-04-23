const { NotFoundError, NotAuthorizedError } = require('../errors');
const userModel = require('../models/User');
const userService = require('./UserService');
const senhaService = require('./SenhaService');
const bcrypt = require('bcrypt');

jest.mock("../models/User");
jest.mock("./SenhaService");
jest.mock('bcrypt');

describe('getUserById', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test(
		'o método recebe o id de um usuário ==> busca o usuário com o id informado',
		async () => {
			const idUsuario = 1;

			userModel.findByPk.mockImplementation(
				() => {
					return { id: idUsuario }
				}
			);

			await userService.getUserById(idUsuario);

			expect(userModel.findByPk).toHaveBeenCalledTimes(1);
			expect(userModel.findByPk.mock.calls[0][0]).toBe(idUsuario);
		}
	);

	describe('o id de um usuário é passado como parâmetro ==> retorna os dados não sensíveis do usuario', () => {
		test.each([
			{
				usuario: { name: 'jorge', password: 'abcd' },
				retornoEsperado: { name: 'jorge' }
			},
			{
				usuario: { name: 'gabi', password: 'abcdefghashud' },
				retornoEsperado: { name: 'gabi' }
			},
			{
				usuario: { name: 'gabriel', password: 'abcdefghijk' },
				retornoEsperado: { name: 'gabriel' }
			},
			{
				usuario: { name: 'bernardo', password: 'abc' },
				retornoEsperado: { name: 'bernardo' }
			},
			{
				usuario: { name: 'vinicius', password: 'a' },
				retornoEsperado: { name: 'vinicius' }
			},
		])
			('%j', ({ usuario, retornoEsperado }) => {
				userModel.findByPk.mockImplementation(() => {
					delete usuario["password"];
					return usuario;
				}
				);
				return expect(userService.getUserById(1)).resolves.toStrictEqual(retornoEsperado);
			});
	});

	test('o usuário não é encontrado ==> lança exceção', async () => {
		const id = 1;

		return expect(async () => {
			await userService.getUserById(id);
		}).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
	});
});

describe('updateUser', () => {

	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('o usuário não é encontrado ==> lança exceção', async () => {
		const id = 1,
			reqUserId = 2,
			reqUserRole = 'admin',
			body = {
				name: 'julio'
			}

		return expect(async () => {
			await userService.updateUser(id, reqUserId, reqUserRole, body);
		}).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
	});

	test('o usuário não é admin porém quer mudar seu próprio role ==> lança exceção', async () => {
		const id = 1,
			reqUserId = 1,
			reqUserRole = 'user',
			body = {
				role: 'admin'
			}

		userModel.findByPk.mockImplementation(
			() => {
				return {
					id: reqUserId,
					role: reqUserRole
				}
			}
		);

		return expect(async () => {
			await userService.updateUser(id, reqUserId, reqUserRole, body);
		}).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para mudar seu papel de usuário'));
	});

	test('o usuário não é admin porém quer atualizar outro usuário ==> lança exceção', async () => {
		const id = 1,
			reqUserId = 2,
			reqUserRole = 'user',
			body = {
				role: 'admin'
			}

		userModel.findByPk.mockImplementation(
			() => {
				return {
					id: reqUserId,
					role: reqUserRole
				}
			}
		);

		return expect(async () => {
			await userService.updateUser(id, reqUserId, reqUserRole, body);
		}).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para atualizar esse usuário'));
	});

	test('o usuário é admin ==> altera outro usuario', async () => {
		const usuario = {
			id: 3,
			name: 'jorge',
			role: 'user',
			update: async (body) => { usuario.name = body.name }
		};

		const id = usuario.id,
			reqUserId = 10,
			reqUserRole = 'admin',
			body = { name: 'gabriel' }

		const userEsperado = {
			...usuario,
			name: 'gabriel'
		};

		userModel.findByPk.mockReturnValue(usuario);

		await userService.updateUser(id, reqUserId, reqUserRole, body);

		expect(usuario).toEqual(userEsperado);
	});

	test('o usuário é user ==> altera a si mesmo', async () => {
		const usuario = {
			id: 3,
			name: 'jorge',
			role: 'user',
			update: async (body) => { usuario.name = body.name }
		};

		const id = usuario.id,
			reqUserId = 3,
			reqUserRole = 'user',
			body = { name: 'gabriel' }

		const usuarioEsperado = {
			...usuario,
			name: 'gabriel'
		};

		userModel.findByPk.mockReturnValue(usuario);

		await userService.updateUser(id, reqUserId, reqUserRole, body);

		expect(usuario).toEqual(usuarioEsperado);
	});

	test('o usuário é admin ==> pode alterar a si mesmo', async () => {
		const usuario = {
			id: 3,
			name: 'jorge',
			role: 'admin',
			update: async (body) => { usuario.name = body.name }
		};
		const id = usuario.id,
			reqUserId = 3,
			reqUserRole = 'admin',
			body = { name: 'gabriel' }

		const userEsperado = {
			...usuario,
			name: 'gabriel'
		};

		userModel.findByPk.mockReturnValue(usuario);

		await userService.updateUser(id, reqUserId, reqUserRole, body);

		expect(usuario).toEqual(userEsperado);
	});
});

describe('getCurrentUser', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	test(
		'o método recebe o id de um usuário ==> busca o usuário com o id informado',
		async () => {
			const idUsuario = 1;

			userModel.findByPk.mockImplementation(
				() => {
					return {
						id: idUsuario
					}
				}
			);

			await userService.getCurrentUser(idUsuario);

			expect(userModel.findByPk.mock.calls[0][0]).toBe(idUsuario);
			expect(userModel.findByPk).toHaveBeenCalledTimes(1);
		}
	);

	test('o usuário é encontrado ==> retorna ele', async () => {
		const idUsuario = 367;
		const usuario = {
			id: idUsuario,
			password: "1234"
		};
		const usuarioEsperado = {
			id: idUsuario
		};

		userModel.findByPk.mockImplementation(() => {
			delete usuario["password"];
			return usuario
		}
		);

		const retorno = await userService.getCurrentUser(idUsuario);

		expect(retorno).toStrictEqual(usuarioEsperado);
	}
	);

	test('o usuário não é encontrado ==> lança exceção', async () => {
		const id = 3425;

		return expect(async () => {
			await userService.getCurrentUser(id);
		}).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
	});
});

describe('createUser', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	test('os dados de usuário são passados como entrada ==> criptografa a senha', async () => {
		const dadosUsuario = {
			id: 20,
			name: "aureliano",
			password: "624hff8"
		}
		const saltRounds = 10;

		userModel.criaNovaInstancia.mockReturnValue({
			...dadosUsuario,
			create: () => { }
		})

		await userService.createUser(dadosUsuario);

		const primeiraChamadaBcrypt = bcrypt.hash.mock.calls[0];
		expect(primeiraChamadaBcrypt).toEqual([dadosUsuario.password, saltRounds]);
	});

	test('a senha é criptografada ==> atualiza senha do usuário a ser criado', async () => {
		const senhaCriptografada = "senha criptografada";
		const dadosUsuario = {
			id: 20,
			name: "aureliano",
			password: "624hff8"
		}
		dadosUsuario.password = senhaCriptografada;

		userModel.criaNovaInstancia.mockImplementation(
			() => { return { create: () => { } } }
		);

		bcrypt.hash.mockReturnValue(senhaCriptografada);

		await userService.createUser(dadosUsuario);

		expect(userModel.criaNovaInstancia.mock.calls[0][0]).toEqual(dadosUsuario);
	});

	test('os dados de usuário são passados como entrada ==> cria este usuário no banco de dados', async () => {
		const dadosUsuario = {
			id: 20,
			name: "aureliano",
			password: "624hff8"
		};
		const novoUsuario = {
			...dadosUsuario,
			create: () => { }
		};

		userModel.criaNovaInstancia.mockReturnValue(novoUsuario);
		const novoUsuarioCreateSpy = jest.spyOn(novoUsuario, 'create');

		await userService.createUser(dadosUsuario);

		expect(novoUsuarioCreateSpy).toHaveBeenCalledTimes(1);
	});
});

describe('getAllUsers', () => {

	beforeEach(() => {
		jest.resetAllMocks()
	});

	test('o método é executado ==> busca todos os usuários',
		async () => {
			userModel.findAll.mockImplementation(
				() => { return [] }
			);

			await userService.getAllUsers();

			expect(userModel.findAll).toHaveBeenCalledTimes(1);
		}
	);

	test('o método é executado ==> retorna todos os usuários',
		async () => {
			const usuarios = [{
				name: 'jorge'
			}, {
				name: 'ben'
			}, {
				name: 'javi'
			}
			];

			userModel.findAll.mockReturnValue(usuarios);

			return expect((await userService.getAllUsers()).sort()).toEqual(usuarios.sort());
		}
	);
});

describe('deleteUser', () => {

	beforeEach(() => {
		jest.resetAllMocks()
	});

	test('o método recebe o id de um usuário ==> deleta esse usuário', async () => {
		const usuario = {
			id: 3,
			delete: () => { }
		};
		const usuarioDeletandoUser = {
			id: 2
		};

		userModel.findByPk.mockImplementation(() => {
			return usuario;
		});
		const usuarioDeleteSpy = jest.spyOn(usuario, 'delete');

		await userService.reqUserDeleteUser(usuario.id, usuarioDeletandoUser.id);

		expect(usuarioDeleteSpy).toHaveBeenCalledTimes(1);
	});

	test('um usuário não é encontrado ==> lança exceção', async () => {
		const id = 1;

		return expect(async () => {
			await userService.reqUserDeleteUser(id);
		}).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
	});

	test('o ID passado é igual ao ID do usuário requisitando ==> lança exceção', async () => {
		const id = 1;
		const reqUserId = 1;

		userModel.findByPk.mockReturnValue({
			id: id
		});

		return expect(async () => {
			await userService.reqUserDeleteUser(id, reqUserId);
		}).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para se deletar!'));
	});

	describe('usersComSenhaFraca', () => {
		beforeEach(() => {
			jest.resetAllMocks()
		});

		test('o método é executado ==> busca todos os usuários no banco de dados', async () => {
			userModel.findAll.mockImplementation(
				() => []
			);

			await userService.usersComSenhaFraca();

			expect(userModel.findAll).toHaveBeenCalledTimes(1);
		});

		describe('usuários são buscados do banco de dados ==> verifica senha fraca de todos os usuários', () => {
			test.each([
				{

					usuarios:
						[
							{ id: 347 },
							{ id: 484 }
						]
				},
				{
					usuarios:
						[
							{ id: 98 }
						]
				},
				{
					usuarios:
						[]
				}

			])(
				'%j',
				async ({ usuarios }) => {
					userModel.findAll.mockReturnValue(usuarios);
					senhaService.senhaFraca.mockImplementation(
						() => true
					);

					await userService.usersComSenhaFraca();

					expect(senhaService.senhaFraca).toHaveBeenCalledTimes(usuarios.length);
				}
			);
		});

		describe('usuários buscados do banco de dados vem com a senha fraca ==> retorna lista com estes usuários', () => {
			test.each([
				{
					usuariosComSenhaFraca: [
						{ id: 1, password: "1234" },
						{ id: 2, password: "abcd" }
					]
				},
				{
					usuariosComSenhaFraca: [
						{ id: 1, password: "1a2b" }
					]
				},
				{
					usuariosComSenhaFraca: []
				}
			])(
				'%j',
				async ({ usuariosComSenhaFraca }) => {
					userModel.findAll.mockReturnValue(usuariosComSenhaFraca);
					senhaService.senhaFraca.mockImplementation(
						() => true
					);

					const retorno = await userService.usersComSenhaFraca();

					expect(retorno).toEqual(expect.arrayContaining(usuariosComSenhaFraca));
					expect(retorno.length).toBe(usuariosComSenhaFraca.length);
				}
			);
		});

		describe('os usuários do banco de dados são buscados ==> retorna uma lista com os usuários de senha fraca', () => {
			test.each([
				{
					usuarios: [
						{ id: 1, password: "1234" },
						{ id: 2, password: "1a3b" },
						{ id: 3, password: "abcd" }
					],
					usuariosEsperados: [
						{ id: 1, password: "1234" },
						{ id: 2, password: "1a3b" },
						{ id: 3, password: "abcd" }
					]
				},
				{
					usuarios: [
						{ id: 1, password: "12345678" },
						{ id: 2, password: "abcdefgf" },
						{ id: 3, password: "a2c4e6gl" }
					],
					usuariosEsperados: []
				},
				{
					usuarios: [
						{ id: 1, password: "123456789" },
						{ id: 2, password: "1234" },
						{ id: 3, password: "abcdefghi" },
						{ id: 4, password: "1a3b" },
						{ id: 5, password: "a2c4e6g8i" },
						{ id: 6, password: "abcd" }
					],
					usuariosEsperados: [
						{ id: 2, password: "1234" },
						{ id: 4, password: "1a3b" },
						{ id: 6, password: "abcd" }
					]
				},
				{
					usuarios: [],
					usuariosEsperados: []
				}
			])(
				'%j',
				async ({ usuarios, usuariosEsperados }) => {
					userModel.findAll.mockReturnValue(usuarios);

					senhaService.senhaFraca.mockImplementation(
						(id) => usuarios.find(usuario => usuario.id == id).password.length < 5
					);

					const retorno = await userService.usersComSenhaFraca();

					expect(retorno).toEqual(expect.arrayContaining(usuariosEsperados));
					expect(retorno.length).toBe(usuariosEsperados.length);
				}
			);
		});
	});

});

describe('idsComMesmoNome', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	test(
		'o método é executado ==> busca todos os usuários',
		async () => {
			userModel.findAll.mockImplementation(
				() => []
			);

			await userService.idsComMesmoNome();

			expect(userModel.findAll).toHaveBeenCalledTimes(1);
		}
	);

	describe('a busca de usuários é feita ==> retorna uma lista de listas do id dos usuários com o mesmo nome', () => {
		test.each([
			{
				usuarios: [
					{ id: 1, name: 'jorge' },
					{ id: 2, name: 'gabi' }
				],
				retornoEsperado: [
					[1], [2]
				]
			},
			{
				usuarios: [
					{ id: 1, name: 'manuel' },
					{ id: 2, name: 'jao' },
					{ id: 3, name: 'manuel' }
				],
				retornoEsperado: [
					[1, 3], [1, 3], [2]
				]
			},
			{
				usuarios: [
					{ id: 1, name: 'manuel' },
					{ id: 2, name: 'jao' },
					{ id: 3, name: 'manuel' },
					{ id: 4, name: 'jao' },
					{ id: 5, name: 'bandeira' }
				],
				retornoEsperado: [
					[1, 3], [2, 4], [5], [2, 4], [1, 3]
				]
			},
			{
				usuarios: [],
				retornoEsperado: []
			}
		])
			('%j', async ({ usuarios, retornoEsperado }) => {
				userModel.findAll.mockReturnValue(usuarios);

				const retorno = await userService.idsComMesmoNome();
				expect(retorno).toEqual(expect.arrayContaining(retornoEsperado));
				expect(retorno.length).toBe(retornoEsperado.length);
			});
	});
});

describe('updateClassificacaoEtariaById', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	test('o método é executado ==> busca o usuário com o id informado', async () => {
			const idUsuario = 1;

			userModel.findByPk.mockReturnValue({
				id: idUsuario,
				age: 12,
				update: () => { }
			});

			await userService.updateClassificacaoEtariaById(idUsuario);

			expect(userModel.findByPk).toHaveBeenCalledTimes(1);
			expect(userModel.findByPk.mock.calls[0][0]).toBe(idUsuario);
		}
	);

	test('um usuário não é encontrado ==> lança exceção', async () => {
		const id = 3425;

		return expect(async () => {
			await userService.updateClassificacaoEtariaById(id);
		}).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
	});

	describe('a busca retorna um usuário com a classificação etária errada ==> retorna esse usuário com a classificação atualizada corretamente', () => {
		test.each([
			{
				user: { id: 1, classificacao_etaria: 'adolescente', age: 5 },
				classificacao_etaria_esperada: 'crianca',
			},
			{
				user: { id: 2, classificacao_etaria: 'adulto', age: 16 },
				classificacao_etaria_esperada: 'adolescente'
			},
			{
				user: { id: 3, classificacao_etaria: 'crianca', age: 30 },
				classificacao_etaria_esperada: 'adulto'
			},

		])
			(
				'%j',
				async ({ user, classificacao_etaria_esperada }) => {
					user.update = async (body) => {
						user.classificacao_etaria = body.classificacao_etaria;
					};
					const userEsperado = {
						...user
					};
					userEsperado.classificacao_etaria = classificacao_etaria_esperada;

					userModel.findByPk.mockReturnValue(user);

					const retorno = await userService.updateClassificacaoEtariaById(user.id);

					expect(retorno).toEqual(userEsperado);
				}
			);
	});

});

describe('deleteBy', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	test('o método recebe o id de um usuário ==> busca o usuário com o id informado', async () => {
			const idUsuario = 1;

			userModel.findByPk.mockImplementation(
				() => { return { delete: () => { } } }
			);

			await userService.deleteBy(idUsuario);

			expect(userModel.findByPk).toHaveBeenCalledTimes(1);
			expect(userModel.findByPk.mock.calls[0][0]).toBe(idUsuario);
		}
	);

	test('o método encontra um usuário ==> deleta esse usuário', async () => {
		const user = {
			id: 3,
			name: 'jorge',
			password: 'abcd',
			classificacao_etaria: 'adolescente',
			age: 15,
			delete: () => { }
		};

		userModel.findByPk.mockImplementation(() => {
			return user;
		});
		const userDeleteSpy = jest.spyOn(user, 'delete');

		await userService.deleteBy(user.id);

		expect(userDeleteSpy).toHaveBeenCalledTimes(1);
	});
});

describe('getNameById', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	});

	describe('um id de um usuário é passado como parâmetro ==> retorna strings diferentes dependendo da primeira letra da string', () => {
		test.each([
			{
				usuario: { id: 1, name: 'joao' },
				retornoEsperado: "O nome do usuário começa com consoante (joao)"
			},
			{
				usuario: { id: 2, name: 'gabi' },
				retornoEsperado: "O nome do usuário começa com consoante (gabi)"
			},
			{
				usuario: { id: 3, name: 'gabriel' },
				retornoEsperado: "O nome do usuário começa com consoante (gabriel)"
			},
			{
				usuario: { id: 4, name: 'iuri' },
				retornoEsperado: "O nome do usuário começa com vogal (iuri)"
			},
			{
				usuario: { id: 5, name: 'amanda' },
				retornoEsperado: "O nome do usuário começa com vogal (amanda)"
			},
		])
			('%j', ({ usuario, retornoEsperado }) => {
				userModel.findByPk.mockReturnValue(usuario);

				return expect(userService.getNameById(usuario.id)).resolves.toEqual(retornoEsperado);
			});
	});

	describe('um id é passado como parâmetro ==> busca o usuário com este id', () => {
		test.each([
			{
				usuario: { id: 2644, name: "picollo" }
			},
			{
				usuario: { id: 1, name: "babidi" }
			},
			{
				usuario: { id: 658896, name: "bulma" }
			}
		])
			('%j', async ({ usuario }) => {
				userModel.findByPk.mockReturnValue(usuario);

				await userService.getNameById(usuario.id);

				expect(userModel.findByPk.mock.calls[0][0]).toBe(usuario.id);
				expect(userModel.findByPk).toHaveBeenCalledTimes(1);
			});
	});

});
