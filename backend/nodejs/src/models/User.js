const User = {
    id: 1,
    name: '',
    password: '',

    create(user) {
        return user;
    },

    findAll(conditions) {
        return ([
            {
                id: 1,
                name: 'jorge',
                password: 'abcd',
            },
            {
                id: 2,
                name: 'maria',
                password: '1234',
            }
        ]);
    },

    findByPk(id, conditions) {
        return {
            id: id,
            name: 'jorge',
            password: 'abcd',
        }
    },


}

module.exports = User;