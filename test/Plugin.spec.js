import { mount, createLocalVue } from "@vue/test-utils";
import { setNotificationsCounter } from "@/notifications";
import Plugin from "@/index";

describe("Plugin", () => {
  beforeEach(() => {
    setNotificationsCounter(0);

    document.title = "default_document_title_value";
  });

  afterEach(() => {
    delete document.title;
    jest.clearAllMocks();
  });

  it("should keep the document.title by default", () => {
    const localVue = createLocalVue();

    localVue.use(Plugin);

    expect(document.title).toEqual("default_document_title_value");
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

  describe("title component option as string", () => {
    it("should render when a string is passed", async () => {
      const localVue = createLocalVue();

      localVue.use(Plugin);

      const Home = {
        title: "Home page",
        template: "<div></div>",
      };

      mount(Home, { localVue });

      expect(document.title).toEqual("Home page");
    });

    it("should fallback to document title when returns null", () => {
      const localVue = createLocalVue();

      localVue.use(Plugin);

      const Home = {
        template: "<div></div>",
        title: null,
      };

      mount(Home, { localVue });

      expect(document.title).toEqual("default_document_title_value");
    });
  });

  describe("title component option as function", () => {
    it("should render when returns a string", async () => {
      const localVue = createLocalVue();

      localVue.use(Plugin);

      const Home = {
        title: () => "Home page",
        template: "<div></div>",
      };

      mount(Home, { localVue });

      expect(document.title).toEqual("Home page");
    });

    it("should render using component data", async () => {
      const localVue = createLocalVue();

      localVue.use(Plugin);

      const Home = {
        title: ({ name }) => `Hello, ${name}`,
        data: () => ({ name: "Peter Venkman " }),
        template: "<div></div>",
      };

      mount(Home, { localVue });

      expect(document.title).toEqual("Hello, Peter Venkman");
    });

    it("should fallback to document title when returns null", () => {
      const localVue = createLocalVue();

      localVue.use(Plugin);

      const Home = {
        template: "<div></div>",
        title: () => null,
      };

      mount(Home, { localVue });

      expect(document.title).toEqual("default_document_title_value");
    });
  });

  it("should render page title in the template using the global computed value", async () => {
    const localVue = createLocalVue();

    const Home = {
      template: "<div class='title'>{{ $pageTitle }}</div>",
      title: "Component title",
    };

    localVue.use(Plugin, {
      suffix: "MyApp",
    });

    const wrapper = mount(Home, { localVue });

    expect(wrapper.find(".title").text()).toEqual("Component title");
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
