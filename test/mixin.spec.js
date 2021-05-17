import { mount } from "@vue/test-utils";
import mixin from "@/mixin";
import { setPreviousTitle, setTitle } from "@/title";

jest.mock("@/title");

describe("mixin", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should set the title", async () => {
    const wrapper = mount({
      mixins: [mixin],
      template: `
        <div>
          <button @click="$setPageTitle('new title')">set title</button>
        </div>
      `,
    });

    await wrapper.find("button").trigger("click");

    expect(setTitle).toHaveBeenCalledWith("new title");
  });

  it("should reset the title on destroy", async () => {
    const wrapper = mount({
      mixins: [mixin],
      template: `
        <div>
          <button @click="$setPageTitle('new title')">set title</button>
        </div>
      `,
    });

    await wrapper.find("button").trigger("click");

    wrapper.destroy();

    expect(setPreviousTitle).toHaveBeenCalled();
  });

  it("should not reset the title on destroy if component title has never been set", async () => {
    const wrapper = mount({
      mixins: [mixin],
      template: "<div></div>",
    });

    wrapper.destroy();

    expect(setPreviousTitle).not.toHaveBeenCalled();
  });
});
