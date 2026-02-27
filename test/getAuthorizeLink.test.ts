import { getAuthorizeLink } from "@kash-88/alerts";

describe('getAuthorizeLink', () => {
  it('The authorization link is correct', () => {
    expect(getAuthorizeLink("1", ["oauth-user-show"])).toBe("https://www.donationalerts.com/oauth/authorize?client_id=1&response_type=code&scope=oauth-user-show");
    expect(getAuthorizeLink("2", ["oauth-user-show", "oauth-donation-subscribe", "oauth-goal-subscribe"])).toBe("https://www.donationalerts.com/oauth/authorize?client_id=2&response_type=code&scope=oauth-user-show%20oauth-donation-subscribe%20oauth-goal-subscribe");
    expect(getAuthorizeLink("3", ["oauth-user-show", "oauth-poll-subscribe", "oauth-custom_alert-store", "oauth-custom_alert-store"])).toBe("https://www.donationalerts.com/oauth/authorize?client_id=3&response_type=code&scope=oauth-user-show%20oauth-poll-subscribe%20oauth-custom_alert-store");
  });
});