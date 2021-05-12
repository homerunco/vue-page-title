import { mount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import Plugin from "@/index";

describe("VueReactiveTitle", () => {
  beforeEach(() => {
    document.title = "Default document title";
  });

  afterEach(() => {
    document.title = "";
    jest.clearAllMocks();
  });

  it("should use document.title when nothing is available", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    expect(document.title).toEqual("Default document title");
  });

  it("should use the route title", async () => {
    const localVue = createLocalVue();

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          meta: {
            title: "Home page",
          },
        },
        {
          name: "about",
          path: "/about",
          meta: {
            title: "About page",
          },
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      title: "MyApp",
      router,
    });

    await router.push("/");

    expect(document.title).toEqual("Home page - MyApp");

    await router.push("/about");

    expect(document.title).toEqual("About page - MyApp");
  });

  it("should use the title only when no route title available", async () => {
    const localVue = createLocalVue();

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      title: "MyApp",
      router,
    });

    await router.push("/");

    expect(document.title).toEqual("MyApp");
  });

  it("should use the route title only", async () => {
    const localVue = createLocalVue();

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          meta: {
            title: "Home page",
          },
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      router,
    });

    await router.push("/");

    expect(document.title).toEqual("Home page");
  });

  it("should use a custom divider", async () => {
    const localVue = createLocalVue();

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          meta: {
            title: "Home page",
          },
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      title: "MyApp",
      divider: "|",
      router,
    });

    await router.push("/");

    expect(document.title).toEqual("Home page | MyApp");
  });

  it("should use title property inside the component", async () => {
    const localVue = createLocalVue();

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("Component title");
      },
    };

    localVue.use(Plugin, {
      title: "MyApp",
    });

    mount(Home, { localVue });

    expect(document.title).toEqual("Component title - MyApp");
  });

  it("should use the component title instead of the route title", async () => {
    const localVue = createLocalVue();

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("Component title");
      },
    };

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          component: Home,
          meta: {
            title: "Route title",
          },
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      title: "MyApp",
      router,
    });

    await router.push("/");

    mount(Home, { localVue, router });

    expect(document.title).toEqual("Component title - MyApp");
  });

  it("should fallback to route title when component removes title", async () => {
    const localVue = createLocalVue();

    const Modal = {
      render: (h) => h("div"),
      title: "Component title",
    };

    const Home = {
      data: () => ({ isOpen: false }),
      components: { Modal },
      template: `
        <div>
          <button @click="isOpen = true">open modal</button>
          <modal @close="isOpen = false" v-if="isOpen" />
        </div>
      `,
    };

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          component: Home,
          meta: {
            title: "Route title",
          },
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      title: "MyApp",
      router,
    });

    await router.push("/");

    const wrapper = mount(Home, { localVue, router });

    await wrapper.find("button").trigger("click");

    expect(document.title).toEqual("Component title - MyApp");

    await wrapper.findComponent(Modal).vm.$emit("close");

    expect(document.title).toEqual("Route title - MyApp");
  });
});
