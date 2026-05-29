import { useAuthorProducts, useDeleteProduct, usePublishProduct, useUnpublishProduct } from '@/hooks/useAuthor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// NO MOCK DATA - REAL API ONLY
export default function AuthorProductsPage() {
  const { t } = useTranslation('common');
  const { data: products, isLoading } = useAuthorProducts();
  const deleteProduct = useDeleteProduct();
  const publishProduct = usePublishProduct();
  const unpublishProduct = useUnpublishProduct();

  const handleDelete = (id: string) => {
    if (confirm(t('confirm_delete_product'))) {
      deleteProduct.mutate(id);
    }
  };

  const handlePublish = (id: string) => {
    publishProduct.mutate(id);
  };

  const handleUnpublish = (id: string) => {
    unpublishProduct.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('my_products')}</h1>
        <Link to="/author/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('add_product')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex gap-2">
                  {product.status === 'published' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnpublish(product.id)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePublish(product.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Link to={`/author/products/${product.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-bold">
                  ${product.price}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{product.sales} {t('sales')}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(product.status)}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {t('revenue')}: ${product.revenue?.toLocaleString() ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t('no_products_yet')}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('start_by_adding_first_product')}
            </p>
            <Link to="/author/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('add_product')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
