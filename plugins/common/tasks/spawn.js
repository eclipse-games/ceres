module.exports = function spawn (serial, origin) {
    this.assets.download('shrek.jpg').then(asset => {
        const keyboard = this.devices.find('keyboard');
        const std = this.libraries.use('std');
        const { id, position, texture, velocity } = std.components;
        const { render2d, move } = std.systems;
        const entity = this.initializer.heap.entities.get(serial);

        texture.of(entity).data = asset;

        if (id.of(entity).valueOf() !== this.connection.id) {
            return this.world.greet(entity, id.of(entity).valueOf());
        }

        keyboard.subscribe('down').filter(() => [ 'w', 'd', 's', 'a' ].some(key => keyboard.key(key))).forEach(() => {
            if (keyboard.key('w')) velocity.of(entity).y = -1;
            if (keyboard.key('d')) velocity.of(entity).x = 1;
            if (keyboard.key('s')) velocity.of(entity).y = 1;
            if (keyboard.key('a')) velocity.of(entity).x = -1;

            this.tasks.create('amend', { id: serial, components: {
                position: position.of(entity),
                velocity: velocity.of(entity)
            } });
        });

        keyboard.subscribe('up').filter(() => [ 'w', 'd', 's', 'a' ].some(key => !keyboard.key(key))).forEach(() => {
            if (!keyboard.key('w') && !keyboard.key('s')) velocity.of(entity).y = 0;
            if (!keyboard.key('d') && !keyboard.key('a')) velocity.of(entity).x = 0;

            this.tasks.create('amend', { id: serial, components: {
                position: position.of(entity),
                velocity: velocity.of(entity)
            } });
        });

        this.world.begin(entity);
    });
};
