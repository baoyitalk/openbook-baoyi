// 定义类型

type buttonType = 'default' | 'primary';

interface Props {
    type? : buttonType
    disable?: boolean
}

const props = 
withDefaults(defineProps<Props>(),{
    type: 'default'
    disable? :Boolean
})

const props = 

withDefaults(defineProps<props>), {
    type: 'default',
    disable: false
}


 const emit = defineEmits = defineEmits<{
    (e: 'click', event： MouseEvent)
 }