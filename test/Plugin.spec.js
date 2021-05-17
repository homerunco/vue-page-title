import { mount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import { clearHistory } from "@/history";
import { setNotificationsCounter } from "@/notifications";
import Plugin from "@/index";

describe("Plugin", () => {
  beforeEach(() => {
    clearHistory();
    setNotificationsCounter(0);
    document.title = "Default document title";
  });

  afterEach(() => {
    delete document.title;
    jest.clearAllMocks();
  });

  it("should keep the document.title by default", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    expect(document.title).toEqual("Default document title");
  });

  it("should use the appName", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      appName: "MyApp",
    });

    expect(document.title).toEqual("MyApp");
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
      appName: "MyApp",
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
      appName: "MyApp",
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
      appName: "MyApp",
      divider: "|",
      router,
    });

    await router.push("/");

    expect(document.title).toEqual("Home page | MyApp");
  });

  it("should set the page title using the global method", async () => {
    const localVue = createLocalVue();

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("Component title");
      },
    };

    localVue.use(Plugin, {
      appName: "MyApp",
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
      appName: "MyApp",
      router,
    });

    await router.push("/");

    mount(Home, { localVue, router });

    expect(document.title).toEqual("Component title - MyApp");
  });

  it("should fallback to the previous title", async () => {
    const localVue = createLocalVue();

    const Child = {
      render: (h) => h("div"),
      title: "Child component title",
    };

    const Home = {
      data: () => ({ isOpen: false }),
      components: { Child },
      template: `
        <div>
          <button @click="isOpen = !isOpen">render child</button>
          <child v-if="isOpen" />
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
      appName: "MyApp",
      router,
    });

    await router.push("/");

    const wrapper = mount(Home, { localVue, router });

    expect(document.title).toEqual("Route title - MyApp");

    await wrapper.find("button").trigger("click");

    expect(document.title).toEqual("Child component title - MyApp");

    await wrapper.find("button").trigger("click");

    expect(document.title).toEqual("Route title - MyApp");
  });

  it("should show notifications count with the current title", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      appName: "MyApp",
    });

    const Home = {
      title: "Home page",
      template: `
          <div>
            <button @click="updateTitle">update</button>
          </div>
        `,
      methods: {
        updateTitle() {
          this.$updateNotificationsCounter(3);
        },
      },
    };

    const wrapper = mount(Home, { localVue });

    await wrapper.find("button").trigger("click");

    expect(document.title).toEqual("(3) Home page - MyApp");
  });

  it("should render the title passed as string to component option", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    const Home = {
      title: "Home page",
      template: `<div>{{ $title }}</div>`,
    };

    const wrapper = mount(Home, { localVue });

    expect(wrapper.element).toMatchSnapshot();
  });

  it("should render the title passed as function to component option", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    const Home = {
      title: () => "Home page",
      template: `<div>{{ $title }}</div>`,
    };

    const wrapper = mount(Home, { localVue });

    expect(wrapper.element).toMatchSnapshot();
  });

  it("should render the title using component data", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    const Home = {
      title: ({ name }) => `Hello, ${name}`,
      data: () => ({ name: "Peter Venkman " }),
      template: `<div>{{ $title }}</div>`,
    };

    const wrapper = mount(Home, { localVue });

    expect(wrapper.element).toMatchSnapshot();
  });

  it("should render parent route title", async () => {
    const localVue = createLocalVue();

    const Child = {
      render: (h) => h("div"),
    };

    const Home = {
      render: (h) => h("router-view"),
    };

    const router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "home",
          path: "/",
          component: Home,
          meta: {
            title: "Parent title",
          },
          children: [
            {
              name: "child",
              path: "child",
              component: Child,
            },
          ],
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      appName: "MyApp",
      router,
    });

    await router.push("/child");

    expect(document.title).toEqual("Parent title - MyApp");
  });

  it("should inherit title from current value", async () => {
    const localVue = createLocalVue();

    const Child = {
      render: (h) => h("div"),
    };

    const Home = {
      template: `
        <div>
          <button @click="$setPageTitle('Parent title')">Set title</button>
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
            inheritPageTitle: true,
          },
          children: [
            {
              name: "child",
              path: "child",
              component: Child,
            },
          ],
        },
      ],
    });

    localVue.use(VueRouter);

    localVue.use(Plugin, {
      appName: "MyApp",
      router,
    });

    await router.push("/");

    const wrapper = mount(Home, { localVue });

    await wrapper.find("button").trigger("click");

    await router.push("/child");

    expect(document.title).toEqual("Parent title - MyApp");
  });
});
