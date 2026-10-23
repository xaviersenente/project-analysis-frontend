import { ref, onMounted, onUnmounted } from "vue";
import { ALL_SECTIONS } from "../js/navigationConfig";
import { SCROLL_CONFIG } from "../js/constants";

/**
 * Composable pour gérer la détection de la section active et le bouton de retour en haut
 * @returns {Object} État et méthodes pour gérer les sections actives et le scroll
 */
export function useActiveSection() {
  const activeSection = ref(null);
  const showScrollTop = ref(false);

  /**
   * Définit la section active
   * @param {string} section - ID de la section
   */
  const setActiveSection = (section) => {
    activeSection.value = section;
  };

  /**
   * Gère le scroll de la page et détecte la section visible
   */
  const handleScroll = () => {
    // Affiche/masque le bouton retour en haut
    showScrollTop.value =
      window.scrollY > SCROLL_CONFIG.scrollTopButtonThreshold;

    // Détection de la section visible
    for (const section of ALL_SECTIONS) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (
          rect.top <= SCROLL_CONFIG.sectionDetectionOffset &&
          rect.bottom >= SCROLL_CONFIG.sectionDetectionOffset
        ) {
          activeSection.value = section;
          break;
        }
      }
    }
  };

  /**
   * Fait défiler la page vers le haut
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Ajoute l'écouteur d'événements au montage
  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  // Retire l'écouteur d'événements au démontage
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    activeSection,
    showScrollTop,
    setActiveSection,
    scrollToTop,
  };
}
