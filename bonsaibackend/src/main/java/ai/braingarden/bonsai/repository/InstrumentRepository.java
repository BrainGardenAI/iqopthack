package ai.braingarden.bonsai.repository;


import ai.braingarden.bonsai.model.Instrument;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "instrument", path = "instrument")
public interface InstrumentRepository extends PagingAndSortingRepository<Instrument, String> {

    Instrument findById(String id);

    @Query(
            value = "SELECT id FROM instrument",
            nativeQuery = true
    )
    List<String> getAllIds();

}
