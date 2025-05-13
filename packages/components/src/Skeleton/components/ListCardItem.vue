<template>
  <div class="j-skeleton-card">
    <div class="j-skeleton-card-content">
      <div class="j-skeleton-item j-skeleton-image"></div>
      <div class="j-skeleton-right">
        <div style="margin-bottom: 16px">
          <Item :active="active" size="small" width="200px" />
        </div>
        <Item :active="active" width="50%" />
        <div class="j-skeleton-right-content">
          <div class="j-skeleton-right-content-item">
            <Item :active="active" size="small" width="100%" />
            <Item :active="active" size="small" width="90%" />
          </div>
          <div class="j-skeleton-right-content-item">
            <Item :active="active" size="small" width="100%" />
            <Item :active="active" size="small" width="90%" />
          </div>
        </div>
      </div>
    </div>
    <div class="j-skeleton-action">
      <Item :active="active" />
      <Item :active="active" />
      <Item :active="active" width="100px" />
    </div>
  </div>
</template>

<script setup name="ListCardItem">
import Item from "./Item.vue";

const props = defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: true,
  }
})
</script>
