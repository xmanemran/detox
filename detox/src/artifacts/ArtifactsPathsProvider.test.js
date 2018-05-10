const _ = require('lodash');
const path = require('path');
const NoConflictArtifactsPathsProvider = require('./ArtifactsPathsProvider');

describe(NoConflictArtifactsPathsProvider, () => {
  let provider;

  beforeEach(() => {
    provider = new NoConflictArtifactsPathsProvider();
  });

  it('should provide path for test artifact', () => {
    const test1 = { title: 'test 1', fullTitle: 'some test 1' };
    const artifactPath1 = provider.constructPathForTestArtifact(test1, '1.log');
    expect(artifactPath1).toBe(path.join(provider.rootDir, '0. ' + test1.fullTitle, '1.log'));

    const test2 = { title: 'test 2', fullTitle: 'some test 2' };
    const artifactPath2 = provider.constructPathForTestArtifact(test2, '1.log');
    expect(artifactPath2).toBe(path.join(provider.rootDir, '1. ' + test2.fullTitle, '1.log'));

    const artifactPath3 = provider.constructPathForTestArtifact(test1, '2.log');
    expect(artifactPath3).toBe(path.join(provider.rootDir, '0. ' + test1.fullTitle, '2.log'));
  });

  it('should protect against relative ".." hacks', () => {
    const normalTest = { fullTitle: 'test', title: 'test' };
    const normalArtifact = 'artifact';
    const hackyTest = { fullTitle: '/../../../test', title: 'test' };
    const hackyArtifactName = '../../../artifact';

    expect(() => provider.constructPathForTestArtifact(normalTest, hackyArtifactName)).toThrowErrorMatchingSnapshot();
    expect(() => provider.constructPathForTestArtifact(hackyTest, normalArtifact)).toThrowErrorMatchingSnapshot();
    expect(() => provider.constructPathForTestArtifact(hackyTest, hackyArtifactName)).toThrowErrorMatchingSnapshot();
  });

  it('should trim too long filenames', () => {
    const actualPath = provider.constructPathForTestArtifact({ title: 'test', fullTitle: '1'.repeat(512) }, '2'.repeat(256));
    const expectedPath = path.join(provider.rootDir, '0. ' + '1'.repeat(252), '2'.repeat(255));

    expect(actualPath).toBe(expectedPath);
  });
});
