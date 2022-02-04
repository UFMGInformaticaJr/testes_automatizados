const User = {
    id: 1,
    name: '',
    password: '',

    create(user) {
        return user;
    },

    findAll(conditions) {
        return [
            {
                id: 1,
                name: 'jorge',
                password: 'abcd',
                destroy()
            },
            {
                id: 2,
                name: 'maria',
                password: '1234',
                destroy()
            }
        ];
    },

    findByPk(id, conditions) {
        return {
            id: id,
            name: 'jorge',
            password: 'abcd',
            destroy()
        }
    },


}

module.exports = User;