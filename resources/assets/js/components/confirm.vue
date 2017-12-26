<template>
    <div>
        <button v-show="!confirm" :class="className" @click.prevent="confirm=!confirm">
    			<slot></slot>
    		</button><span v-show="confirm" class='btn btn--nohover btn--transparent' :class="sureClass">
    			Sure?
    		</span><button v-show="confirm" class="btn btn--red" @click.prevent="func()">
    			Yes
    		</button><button v-show="confirm" class="btn btn--gray" @click.prevent="confirm=!confirm">
    			No
    		</button>
    </div>
</template>
<script>
    export default {
        props: {
            className: String,
            sureClass: String,
            func: {
                type: Function,
                required: true
            }
        },
        data: function() {
            return {
                confirm: false
            };
        }
    }
</script>
