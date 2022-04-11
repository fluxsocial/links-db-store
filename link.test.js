const { addLink, updateLink, removeLink, queryLinks } = require('@perspect3vism/ad4m-test/helpers')

describe("Link", () => {
  it("Create Link", async () => {
    const all = await queryLinks({});

    expect(all.length).toBe(0)
    const link = await addLink({source:"root", target:"QmYVsrMpiFmV9S7bTWNAkUzSqjRJskQ8g4TWKKwKrHAPqL://QmSsCCtXMDAZXMpyiNLzwjGEU4hLmhG7fphidhEEodQ4Wy"})

    const all1 = await queryLinks({});

    expect(all1.length).toBe(1)
    expect(all1[0].data.source).toBe(link.data.source)
    expect(all1[0].data.predicate).toBe(link.data.predicate)
    expect(all1[0].data.target).toBe(link.data.target)

    const allRoots = await queryLinks({source: "root"});

    expect(allRoots.length).toBe(1)
    expect(allRoots[0].data.source).toBe(link.data.source)
    expect(allRoots[0].data.predicate).toBe(link.data.predicate)
    expect(allRoots[0].data.target).toBe(link.data.target)
  });

  it("Remove Link", async () => {
    const all = await queryLinks({});

    expect(all.length).toBe(0)
    const link = await addLink({source:"root", target:"QmYVsrMpiFmV9S7bTWNAkUzSqjRJskQ8g4TWKKwKrHAPqL://QmSsCCtXMDAZXMpyiNLzwjGEU4hLmhG7fphidhEEodQ4Wy"})

    const all1 = await queryLinks({});

    expect(all1.length).toBe(1)
    
    const removedlink = await removeLink(link)

    const all2 = await queryLinks({});

    expect(all2.length).toBe(0)
  });
})