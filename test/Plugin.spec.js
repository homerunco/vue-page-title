import { mount, createLocalVue } from "@vue/test-utils";
import { setNotificationsCounter } from "@/notifications";
import Plugin from "@/index";

describe("Plugin", () => {
  beforeEach(() => {
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

  it("should use the prefix", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      prefix: "MyApp",
    });

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("My title");
      },
    };

    mount(Home, { localVue });

    expect(document.title).toEqual("MyApp - My title");
  });

  it("should use the suffix", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      suffix: "MyApp",
    });

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("My title");
      },
    };

    mount(Home, { localVue });

    expect(document.title).toEqual("My title - MyApp");
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
      suffix: "MyApp",
    });

    mount(Home, { localVue });

    expect(document.title).toEqual("Component title - MyApp");
  });

  it("should use a custom divider", async () => {
    const localVue = createLocalVue();

    const Home = {
      template: "<div>home page</div>",
      mounted() {
        this.$setPageTitle("Home page");
      },
    };

    localVue.use(Plugin, {
      suffix: "MyApp",
      divider: "|",
    });

    mount(Home, { localVue });

    expect(document.title).toEqual("Home page | MyApp");
  });

  it("should update the notifications count with the current title", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      suffix: "MyApp",
    });

    const Home = {
      title: "Home page",
      template: `
          <div>
            <button @click="$setPageTitleNotifications(3)">add notifications</button>
            <button @click="$setPageTitleNotifications(0)">remove notifications</button>
          </div>
        `,
    };

    const wrapper = mount(Home, { localVue });

    expect(document.title).toEqual("Home page - MyApp");

    await wrapper.findAll("button").at(0).trigger("click");

    expect(document.title).toEqual("(3) Home page - MyApp");

    await wrapper.findAll("button").at(1).trigger("click");

    expect(document.title).toEqual("Home page - MyApp");
  });

  it("should render 99+ when notification count is higher than 99", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      suffix: "MyApp",
    });

    const Home = {
      title: "Home page",
      template: `
          <div>
            <button @click="$setPageTitleNotifications(1200)">add notifications</button>
          </div>
        `,
    };

    const wrapper = mount(Home, { localVue });

    await wrapper.find("button").trigger("click");

    expect(document.title).toEqual("(99+) Home page - MyApp");
  });

  it("should render the title passed as string to component option", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    const Home = {
      title: "Home page",
      template: `<div>{{ $pageTitle }}</div>`,
    };

    const wrapper = mount(Home, { localVue });

    expect(wrapper.element).toMatchSnapshot();
  });

  it("should render the title passed as function to component option", async () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    const Home = {
      title: () => "Home page",
      template: `<div>{{ $pageTitle }}</div>`,
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
      template: `<div>{{ $pageTitle }}</div>`,
    };

    const wrapper = mount(Home, { localVue });

    expect(wrapper.element).toMatchSnapshot();
  });

  it("should not add prefix when title has same value", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      prefix: "MyApp",
    });

    const Home = {
      title: "MyApp",
      template: "<div></div>",
    };

    mount(Home, { localVue });

    expect(document.title).toEqual("MyApp");
  });

  it("should not add suffix when title has same value", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin, {
      suffix: "MyApp",
    });

    const Home = {
      title: "MyApp",
      template: "<div></div>",
    };

    mount(Home, { localVue });

    expect(document.title).toEqual("MyApp");
  });
});
