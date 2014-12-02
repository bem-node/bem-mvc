BEM.TEST.decl('i-model__field_type_model', function() {

    describe('Field with type "model"', function() {
        BEM.MODEL.decl('model-type-field', {
            f: {
                type: 'model',
                modelName: 'inner-model',
                destruct: true,
                validation: {
                    rules: {
                        deep: true,
                        required: true
                    }
                }
            }
        });
        BEM.MODEL.decl('inner-model', {
            innerF: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            }
        });

        it('should change values', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', { innerF: 'new str' });


            expect(model.get('f').get('innerF')).toEqual('new str');

            waitsFor(function () {
                return onFieldChange.wasCalled;
            }, 'onFieldChange was called');

            waitsFor(function () {
                return onModelChange.wasCalled;
            }, 'onModelChange was called');

            runs(function () {
                model.destruct();
                expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
                expect(BEM.MODEL.get('inner-model').length).toEqual(0);
            });
        });

        it('should set model as value', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),
                modelToSet = BEM.MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onInnerFieldChange = jasmine.createSpy('onInnerFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', modelToSet);

            expect(model.get('f').get('innerF')).toEqual('inner2');

            waitsFor(function () {
               return onFieldChange.wasCalled;
            }, 'onFieldChange was Called');

            waitsFor(function () {
               return onModelChange.wasCalled;
            }, 'onModelChange was Called');

            runs(function () {
                model.on('f', 'change', onInnerFieldChange);
                modelToSet.set('innerF', 'bla');
            });

            waitsFor(function () {
               return onInnerFieldChange.wasCalled;
            }, 'onInnerFieldChange was Called');

            runs(function () {
                model.destruct();
                expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
                expect(BEM.MODEL.get('inner-model').length).toEqual(0);
            });

        });

        it('should change inner value', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = jasmine.createSpy('onFieldChange'),
                onModelChange = jasmine.createSpy('onModelChange');

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.get('f').set('innerF', 'new str');

            expect(model.get('f').get('innerF')).toEqual('new str');

            waitsFor(function () {
               return onFieldChange.wasCalled;
            }, 'onFieldChange was Called');

            waitsFor(function () {
               return onModelChange.wasCalled;
            }, 'onModelChange was Called');

            runs(function () {
                model.destruct();
                expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
                expect(BEM.MODEL.get('inner-model').length).toEqual(0);
            });

        });

        it('isChanged() should return true if inner model was changed', function () {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                });

            expect(model.isChanged()).toEqual(false);

            model.get('f').set('innerF', 'new value');

            expect(model.isChanged()).toEqual(true);
            model.destruct();
        });

        it('should serialize data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            expect(model.toJSON()).toEqual({
                f: {
                    innerF: 'str'
                }
            });

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should clear data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.clear();

            expect(model.isEmpty()).toEqual(true);

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should fix and rollback data', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.get('f').set('innerF', 'correct str');
            model.fix();

            model.get('f').set('innerF', 'wrong str');
            expect(model.get('f').get('innerF')).toEqual('wrong str');

            model.rollback();
            expect(model.get('f').get('innerF')).toEqual('correct str');

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should not destruct inner model', function() {
            var model = BEM.MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            }),
            innerModel = model.get('f'),
            modelToSet = BEM.MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' });

            model.set('f', modelToSet, { destruct: false });
            expect(BEM.MODEL.getOne({ name: 'inner-model', id: innerModel.id })).toBeDefined();

            model.destruct();
            innerModel.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should check validation', function() {
            var model = BEM.MODEL.create('model-type-field');

            expect(model
                .set('f', { innerF: 'string' })
                .isValid())
                .toBe(true);

            expect(model
                .set('f', { innerF: 'loooooooooong string' })
                .isValid())
                .toBe(false);

            expect(model
                .clear('f')
                .isValid())
                .toBe(false);

            model.destruct();
            expect(BEM.MODEL.get('model-type-field').length).toEqual(0);
            expect(BEM.MODEL.get('inner-model').length).toEqual(0);
        });

        it('should bubble events from inner model', function() {
            var model = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),
                newInner,
                model2,
                onCustom = jasmine.createSpy('onCustom'),
                onNewCustom = jasmine.createSpy('onNewCustom');

            model.on('f', 'custom-event', onCustom);
            model.get('f').trigger('custom-event');

            waitsFor(function () {
                return onCustom.wasCalled;
            }, 'onCustom was called');

            runs(function () {
                newInner = BEM.MODEL.create('inner-model', { innerF: 'str1' });

                model.on('f', 'new-custom-event', onNewCustom);
                model.set('f', newInner);
                newInner.trigger('new-custom-event');

                model2 = BEM.MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                });

                model2.get('f').trigger('custom-event');


            });

            waitsFor(function () {
                return onNewCustom.wasCalled;
            }, 'onNewCustom was called');

            runs(function () {
                model.destruct();
                model2.destruct();
                expect(onCustom.calls.length).toEqual(1);
            });

        });

    });

});
