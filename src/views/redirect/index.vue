<script>
import { defineComponent , h} from 'vue'
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter()
    const { params ,query }= useRoute()
    const { path } = params
    router.replace({path: '/'+ path, query})
  },
})
</script>
