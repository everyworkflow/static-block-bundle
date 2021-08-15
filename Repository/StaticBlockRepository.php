<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\Repository;

use EveryWorkflow\CoreBundle\Annotation\RepoDocument;
use EveryWorkflow\MongoBundle\Repository\BaseDocumentRepository;
use EveryWorkflow\StaticBlockBundle\Document\StaticBlockDocument;

/**
 * @RepoDocument(doc_name=StaticBlockDocument::class)
 */
class StaticBlockRepository extends BaseDocumentRepository implements StaticBlockRepositoryInterface
{
    protected string $collectionName = 'static_block_collection';
    protected array $indexNames = [StaticBlockDocument::KEY_BLOCK_KEY];
}
