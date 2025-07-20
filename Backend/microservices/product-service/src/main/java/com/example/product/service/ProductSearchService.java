package com.example.product.service;

import com.example.product.entity.Product;
import com.example.product.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.FuzzyQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.PrefixQuery;

import static org.elasticsearch.index.query.QueryBuilders.*;

@Service
@RequiredArgsConstructor
public class ProductSearchService {
    
    private final ProductSearchRepository productSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProductSearchService.class);

    public List<Product> searchProducts(String query) {
        log.info("Searching products with query: {}", query);
        
        co.elastic.clients.elasticsearch._types.query_dsl.Query multiMatch = MultiMatchQuery.of(m -> m
                .fields("name^2", "description")
                .query(query)
                .type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields)
        )._toQuery();

        org.springframework.data.elasticsearch.core.query.Query searchQuery = NativeQuery.builder()
                .withQuery(multiMatch)
                .build();
        
        SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
        return searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public Optional<Product> findByBarcode(String barcode) {
        log.info("Searching product by barcode: {}", barcode);
        return productSearchRepository.findByBarcode(barcode);
    }

    public List<Product> searchByCategory(String categoryName) {
        log.info("Searching products by category: {}", categoryName);
        return productSearchRepository.findByCategoryCategoryNameContainingIgnoreCase(categoryName);
    }

    public List<Product> fuzzySearch(String query) {
        log.info("Fuzzy searching products with query: {}", query);
        
        co.elastic.clients.elasticsearch._types.query_dsl.Query fuzzy = FuzzyQuery.of(f -> f
                .field("name")
                .value(query)
                .fuzziness("AUTO")
        )._toQuery();

        org.springframework.data.elasticsearch.core.query.Query searchQuery = NativeQuery.builder()
                .withQuery(fuzzy)
                .build();
        
        SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
        return searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public List<String> getAutocompleteSuggestions(String prefix) {
        log.info("Getting autocomplete suggestions for: {}", prefix);
        
        co.elastic.clients.elasticsearch._types.query_dsl.Query prefixQuery = PrefixQuery.of(p -> p
                .field("name")
                .value(prefix)
        )._toQuery();

        org.springframework.data.elasticsearch.core.query.Query searchQuery = NativeQuery.builder()
                .withQuery(prefixQuery)
                .withMaxResults(10)
                .build();
        
        SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
        return searchHits.getSearchHits().stream()
                .map(hit -> hit.getContent().getName())
                .distinct()
                .collect(Collectors.toList());
    }

    public void indexProduct(Product product) {
        log.info("Indexing product: {}", product.getName());
        productSearchRepository.save(product);
    }

    public void deleteProductFromIndex(Long productId) {
        log.info("Deleting product from index: {}", productId);
        productSearchRepository.deleteById(productId);
    }
} 