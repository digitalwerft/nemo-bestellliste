<template>
    <transition name="modal">
        <div class="modal-mask modal">
            <div class="modal-wrapper modal-dialog">
                <div class="modal-container modal-content">

                    <div class="modal-header">
                        <slot name="header">
                            <h5 class="modal-title">default header</h5>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="btn btn-primary" @click="$emit('close')">OK</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
