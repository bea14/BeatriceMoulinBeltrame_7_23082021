<template>
  <div class="post-rules">
    <div class="post-rules-head">
      <span>Le forum a un modérateur. Vous pouvez faire appel à lui/elle
        et signaler des articles/commentaires/utilisateurs</span>
    </div>
    <div class="rules">
      <span>1. Souviens-toi de l'humain</span>
      <span>2. Comportez-vous comme vous le feriez dans la vraie vie</span>
      <span>3. Rechercher la source originale du contenu</span>
      <span>4. Rechercher les doublons avant de poster</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.post-rules {
  display: flex;
  background-color: white;
  border-radius: 5px;
  flex-direction: column;
  &-head {
    display: flex;
    align-items: center;
    padding: 15px 10px;
    span {
      font-size: 14px;
      font-weight: bold;
      opacity: 0.8;
    }
  }
  .rules {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid rgb(221, 217, 217);
    span {
      line-height: 40px;
      font-size: 13px;
      opacity: 0.8;
      padding-left: 10px;
      border-bottom: 1px solid rgb(216, 213, 213);
      border-width: 50%;
    }
  }
}
</style>
