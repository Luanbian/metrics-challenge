import { BaseInput, Card, BaseButton } from "../components/index";

const GlobalComponents = {
  install(Vue) {
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(Card.name, Card);
    Vue.component(BaseButton.name, BaseButton);
  }
};

export default GlobalComponents;
