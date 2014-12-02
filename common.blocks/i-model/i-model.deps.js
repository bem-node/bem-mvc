({
    mustDeps: [
        {block: 'i-jquery', elems: ['inherit', 'observable-async']}
    ],
    shouldDeps: [
        {
            elem: 'field',
            mods: {
                type: [
                    'inner-events-storage',
                    'id',
                    'string',
                    'number',
                    'boolean',
                    'model',
                    'array',
                    'models-list'
                ]
            }
        }
    ]
})
