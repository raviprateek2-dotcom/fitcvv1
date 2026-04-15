import { templateCatalog, templateCategoryLabels } from '@/lib/template-catalog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { templateRegistryKeys } from '@/components/editor/templates/template-registry';

describe('templateCatalog', () => {
  it('has at least 8 production templates', () => {
    expect(templateCatalog.length).toBeGreaterThanOrEqual(8);
  });

  it('contains unique template ids', () => {
    const ids = templateCatalog.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ensures each template has valid category and use case', () => {
    for (const item of templateCatalog) {
      expect(templateCategoryLabels[item.category]).toBeTruthy();
      expect(item.useCase.trim().length).toBeGreaterThan(10);
      expect(item.atsReady).toBe(true);
      expect(item.isOriginal).toBe(true);
    }
  });

  it('stays in sync with registry keys and preview assets', () => {
    const catalogIds = new Set(templateCatalog.map((t) => t.id));
    const registryIds = new Set(templateRegistryKeys);
    expect(catalogIds).toEqual(registryIds);

    const imageIds = new Set(PlaceHolderImages.map((i) => i.id));
    for (const item of templateCatalog) {
      expect(imageIds.has(`template-${item.id}`)).toBe(true);
    }
  });
});
