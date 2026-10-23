import { ref } from "vue";

/**
 * Composable pour gérer l'état et le comportement du menu mobile
 * @returns {Object} État et méthodes pour gérer la navigation mobile
 */
export function useMobileNav() {
  const mobileNavOpen = ref(false);

  /**
   * Bascule l'état d'ouverture/fermeture du menu mobile
   */
  const toggleMobileNav = () => {
    mobileNavOpen.value = !mobileNavOpen.value;
  };

  /**
   * Ferme le menu mobile
   */
  const closeMobileNav = () => {
    mobileNavOpen.value = false;
  };

  /**
   * Ouvre le menu mobile
   */
  const openMobileNav = () => {
    mobileNavOpen.value = true;
  };

  return {
    mobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    openMobileNav,
  };
}
